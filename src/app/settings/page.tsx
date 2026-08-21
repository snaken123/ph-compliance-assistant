'use client';

import React, { useEffect, useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Sparkles, 
  Database, 
  Download, 
  MapPin, 
  Building2, 
  Save, 
  CheckCircle2,
  FileCheck2,
  Lock,
  CreditCard
} from 'lucide-react';
import { PHILIPPINE_PROVINCES, POPULAR_BIR_RDOS } from '@/lib/ph-locations';

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Address & LGU Form State
  const [locationForm, setLocationForm] = useState({
    businessName: 'FlowForceRM',
    tradeName: 'FlowForceRM',
    businessActivity: 'SaaS / Software Development',
    province: 'Metro Manila (NCR)',
    cityMunicipality: 'Quezon City',
    barangay: '',
    addressDetail: '',
    propertyType: 'owned_residence',
    
    // Tax & Govt IDs
    tinNumber: '',
    birRdoNumber: 'RDO 039 - South Quezon City',
    sssNumber: '',
    philHealthPin: '',
    pagIbigMid: '',
    dtiCertificateNo: '',
    lguBinNumber: '',

    isHomeBased: true,
    isOnline: true,
    monthlyGrossReceipts: 10000,
    hasEmployees: false,
    hasContractors: true,
    taxRegime: 'EIGHT_PERCENT',
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
        setProfile(data.profile);
        setLocationForm({
          businessName: data.profile.businessName || 'FlowForceRM',
          tradeName: data.profile.tradeName || 'FlowForceRM',
          businessActivity: data.profile.businessActivity || 'SaaS / Software Development',
          province: data.profile.province || 'Metro Manila (NCR)',
          cityMunicipality: data.profile.cityMunicipality || 'Quezon City',
          barangay: data.profile.barangay || '',
          addressDetail: data.profile.addressDetail || '',
          propertyType: data.profile.propertyType || 'owned_residence',

          // Govt Identifiers
          tinNumber: data.profile.tinNumber || '',
          birRdoNumber: data.profile.birRdoNumber || 'RDO 039 - South Quezon City',
          sssNumber: data.profile.sssNumber || '',
          philHealthPin: data.profile.philHealthPin || '',
          pagIbigMid: data.profile.pagIbigMid || '',
          dtiCertificateNo: data.profile.dtiCertificateNo || '',
          lguBinNumber: data.profile.lguBinNumber || '',

          isHomeBased: data.profile.isHomeBased ?? true,
          isOnline: data.profile.isOnline ?? true,
          monthlyGrossReceipts: data.profile.monthlyGrossReceipts || 10000,
          hasEmployees: data.profile.hasEmployees ?? false,
          hasContractors: data.profile.hasContractors ?? true,
          taxRegime: data.profile.taxRegime || 'EIGHT_PERCENT',
          mode: data.profile.mode || 'REGISTRATION'
        });
      }
    } catch (err) {
      console.error('Failed fetching profile settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLocationAndSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(locationForm)
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.profile);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 5000);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const toggleMode = async (newMode: string) => {
    const updatedForm = { ...locationForm, mode: newMode };
    setLocationForm(updatedForm);
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedForm)
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.profile);
      }
    } catch (err) {
      console.error('Error toggling mode:', err);
    } finally {
      setSaving(false);
    }
  };

  const availableCities = PHILIPPINE_PROVINCES[locationForm.province] || ['Quezon City', 'Makati City', 'Taguig City (BGC)', 'Pasig City'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-slate-400 text-sm animate-pulse">Loading LGU & Location Settings...</div>
      </div>
    );
  }

  const currentMode = profile?.mode || 'REGISTRATION';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">LGU Location & Business Settings</h1>
            <p className="text-xs text-slate-400">
              Select your exact Philippine Region, City/Municipality, Barangay, and Tax Identifiers (BIR TIN, RDO, SSS, PhilHealth, Pag-IBIG).
            </p>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>
            Location updated to <strong className="text-white">{locationForm.barangay || 'Local Barangay'}, {locationForm.cityMunicipality}, {locationForm.province}</strong>. Dynamic statutory requirements & BIR rules updated!
          </span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveLocationAndSettings} className="space-y-6">
        
        {/* Section 1: LGU Location & Address Dropdowns */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
            <MapPin className="w-5 h-5" />
            <h3>1. Local Government Unit (LGU) Dropdown Selector</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Province Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Province / Region Dropdown</label>
              <select
                value={locationForm.province}
                onChange={(e) => {
                  const newProv = e.target.value;
                  const newCities = PHILIPPINE_PROVINCES[newProv] || [];
                  setLocationForm({
                    ...locationForm,
                    province: newProv,
                    cityMunicipality: newCities[0] || ''
                  });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {Object.keys(PHILIPPINE_PROVINCES).map((prov) => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>

            {/* City / Municipality Filtered Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">City / Municipality Dropdown</label>
              <select
                value={locationForm.cityMunicipality}
                onChange={(e) => setLocationForm({ ...locationForm, cityMunicipality: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {availableCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Barangay Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Barangay Name</label>
              <input
                type="text"
                value={locationForm.barangay}
                onChange={(e) => setLocationForm({ ...locationForm, barangay: e.target.value })}
                placeholder="e.g. Barangay San Lorenzo, Barangay Bel-Air"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Street Address / Condo / Unit Detail</label>
            <input
              type="text"
              value={locationForm.addressDetail}
              onChange={(e) => setLocationForm({ ...locationForm, addressDetail: e.target.value })}
              placeholder="e.g. Unit 1204, High Street South Corporate Plaza, BGC"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Section 2: Government Identifiers (BIR TIN, RDO, SSS, PhilHealth, Pag-IBIG) */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
            <CreditCard className="w-5 h-5" />
            <h3>2. Government Compliance Identifiers & Tax Numbers</h3>
          </div>
          <p className="text-xs text-slate-400">
            Store your official BIR, SSS, PhilHealth, and Pag-IBIG registration numbers for automated form filling and deadline reminders.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* BIR TIN */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">BIR Taxpayer Identification Number (TIN)</label>
              <input
                type="text"
                value={locationForm.tinNumber}
                onChange={(e) => setLocationForm({ ...locationForm, tinNumber: e.target.value })}
                placeholder="e.g. 123-456-789-00000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            {/* BIR RDO Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">BIR Revenue District Office (RDO)</label>
              <select
                value={locationForm.birRdoNumber}
                onChange={(e) => setLocationForm({ ...locationForm, birRdoNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              >
                {POPULAR_BIR_RDOS.map((rdo) => (
                  <option key={rdo} value={rdo}>{rdo}</option>
                ))}
              </select>
            </div>

            {/* SSS Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">SSS Self-Employed SS Number</label>
              <input
                type="text"
                value={locationForm.sssNumber}
                onChange={(e) => setLocationForm({ ...locationForm, sssNumber: e.target.value })}
                placeholder="e.g. 34-1234567-8"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            {/* PhilHealth PIN */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">PhilHealth Identification Number (PIN)</label>
              <input
                type="text"
                value={locationForm.philHealthPin}
                onChange={(e) => setLocationForm({ ...locationForm, philHealthPin: e.target.value })}
                placeholder="e.g. 12-345678901-2"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            {/* Pag-IBIG MID */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Pag-IBIG Member ID (MID)</label>
              <input
                type="text"
                value={locationForm.pagIbigMid}
                onChange={(e) => setLocationForm({ ...locationForm, pagIbigMid: e.target.value })}
                placeholder="e.g. 1212-3456-7890"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            {/* DTI Certificate No */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">DTI BNR Certificate Number</label>
              <input
                type="text"
                value={locationForm.dtiCertificateNo}
                onChange={(e) => setLocationForm({ ...locationForm, dtiCertificateNo: e.target.value })}
                placeholder="e.g. BNR-2026-0098124"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving & Recalculating LGU Rules...' : 'Save LGU Address & Compliance Identifiers'}
          </button>
        </div>

      </form>

    </div>
  );
}
