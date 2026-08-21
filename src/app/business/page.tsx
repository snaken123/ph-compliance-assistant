'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  Users, 
  DollarSign, 
  FileCheck2, 
  Save, 
  CheckCircle2, 
  Sparkles,
  HelpCircle
} from 'lucide-react';

export default function BusinessProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    businessName: 'FlowForceRM',
    tradeName: 'FlowForceRM',
    businessActivity: 'SaaS / Software Development',
    isOnline: true,
    isHomeBased: true,
    propertyType: 'owned_residence',
    province: 'Metro Manila',
    cityMunicipality: 'Quezon City',
    barangay: 'Barangay Holy Spirit',
    addressDetail: 'Block 14 Lot 8, Commonwealth Ave, Quezon City',
    hasEmployees: false,
    employeeCount: 0,
    hasContractors: true,
    hasForeignClients: true,
    hasLocalClients: true,
    monthlyGrossReceipts: 10000,
    taxRegime: 'EIGHT_PERCENT',
    mode: 'REGISTRATION'
  });

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile) {
          setFormData({
            businessName: data.profile.businessName || 'FlowForceRM',
            tradeName: data.profile.tradeName || 'FlowForceRM',
            businessActivity: data.profile.businessActivity || 'SaaS / Software Development',
            isOnline: data.profile.isOnline ?? true,
            isHomeBased: data.profile.isHomeBased ?? true,
            propertyType: data.profile.propertyType || 'owned_residence',
            province: data.profile.province || 'Metro Manila',
            cityMunicipality: data.profile.cityMunicipality || 'Quezon City',
            barangay: data.profile.barangay || 'Barangay Holy Spirit',
            addressDetail: data.profile.addressDetail || 'Quezon City',
            hasEmployees: data.profile.hasEmployees ?? false,
            employeeCount: data.profile.employeeCount ?? 0,
            hasContractors: data.profile.hasContractors ?? true,
            hasForeignClients: data.profile.hasForeignClients ?? true,
            hasLocalClients: data.profile.hasLocalClients ?? true,
            monthlyGrossReceipts: data.profile.monthlyGrossReceipts || 10000,
            taxRegime: data.profile.taxRegime || 'EIGHT_PERCENT',
            mode: data.profile.mode || 'REGISTRATION'
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Error updating business profile:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-slate-400 text-sm animate-pulse">Loading Business Profile Questionnaire...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Business Profile & Guided Onboarding Questionnaire</h1>
            <p className="text-xs text-slate-400">
              Configure your exact business parameters to dynamically determine applicable Philippine legal requirements.
            </p>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Business profile saved! Dynamic rule engine has updated your legal requirements matrix.</span>
        </div>
      )}

      {/* Questionnaire Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Basic Identity */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-blue-400 flex items-center">
            <Building2 className="w-4 h-4 mr-2" /> 1. Business Identity & Nature
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Registered Business Name</label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Trade / Brand Name</label>
              <input
                type="text"
                value={formData.tradeName}
                onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Business Activity</label>
              <input
                type="text"
                value={formData.businessActivity}
                onChange={(e) => setFormData({ ...formData, businessActivity: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                placeholder="e.g. SaaS / Software Development / Online Subscription"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Location & Home-Based Status */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-amber-400 flex items-center">
            <MapPin className="w-4 h-4 mr-2" /> 2. Location & Operating Setup
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Province / Region</label>
              <input
                type="text"
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">City / Municipality</label>
              <input
                type="text"
                value={formData.cityMunicipality}
                onChange={(e) => setFormData({ ...formData, cityMunicipality: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Barangay</label>
              <input
                type="text"
                value={formData.barangay}
                onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <input
                type="checkbox"
                id="isHomeBased"
                checked={formData.isHomeBased}
                onChange={(e) => setFormData({ ...formData, isHomeBased: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-slate-950 border-slate-700"
              />
              <label htmlFor="isHomeBased" className="text-xs text-slate-200 cursor-pointer">
                <span className="font-semibold block">Home-based Operation</span>
                <span className="text-slate-400 text-[11px]">Operated from residence with no separate commercial office</span>
              </label>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <input
                type="checkbox"
                id="isOnline"
                checked={formData.isOnline}
                onChange={(e) => setFormData({ ...formData, isOnline: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-slate-950 border-slate-700"
              />
              <label htmlFor="isOnline" className="text-xs text-slate-200 cursor-pointer">
                <span className="font-semibold block">100% Online Business</span>
                <span className="text-slate-400 text-[11px]">No physical storefront or walk-in customer traffic</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: People & Workforce */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-purple-400 flex items-center">
            <Users className="w-4 h-4 mr-2" /> 3. People & Workforce Structure
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200">Formal Employees?</label>
                <input
                  type="checkbox"
                  checked={formData.hasEmployees}
                  onChange={(e) => setFormData({ ...formData, hasEmployees: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-slate-950 border-slate-700"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Staff under direct employment contracts with regular wages and employer supervision.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200">Independent Contractors?</label>
                <input
                  type="checkbox"
                  checked={formData.hasContractors}
                  onChange={(e) => setFormData({ ...formData, hasContractors: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-slate-950 border-slate-700"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Freelancers, software devs, marketers, or commission-based agents issuing service invoices.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Revenue & Tax Option */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-emerald-400 flex items-center">
            <DollarSign className="w-4 h-4 mr-2" /> 4. Revenue & BIR Tax Option
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Estimated Monthly Gross Receipts: <strong className="text-emerald-400">₱{formData.monthlyGrossReceipts.toLocaleString()}</strong>
              </label>
              <input
                type="range"
                min="5000"
                max="300000"
                step="5000"
                value={formData.monthlyGrossReceipts}
                onChange={(e) => setFormData({ ...formData, monthlyGrossReceipts: Number(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Annual Equivalent: ₱{(formData.monthlyGrossReceipts * 12).toLocaleString()}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Tax Regime</label>
              <select
                value={formData.taxRegime}
                onChange={(e) => setFormData({ ...formData, taxRegime: e.target.value as any })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="EIGHT_PERCENT">8% Gross Income Tax Rate (TRAIN Act - Recommended for &lt;₱3M)</option>
                <option value="GRADUATED">Graduated Income Tax Rates (0%-35%) + 3% Percentage Tax</option>
                <option value="UNDECIDED">Undecided (Simulate in Tax Calculator)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving & Recalculating Rules...' : 'Save Profile & Recalculate Compliance Matrix'}
          </button>
        </div>

      </form>

    </div>
  );
}
