'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Plus, 
  FileText,
  HelpCircle,
  TrendingDown
} from 'lucide-react';

export default function ContractorsPage() {
  const [contractors, setContractors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [contractorName, setContractorName] = useState('');
  const [serviceProvided, setServiceProvided] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('15000');
  
  // 4-Fold Control Test Criteria
  const [hasFixedHours, setHasFixedHours] = useState(false);
  const [usesCompanyEquipment, setUsesCompanyEquipment] = useState(false);
  const [isExclusive, setIsExclusive] = useState(false);
  const [hasDirectSupervision, setHasDirectSupervision] = useState(false);

  useEffect(() => {
    loadContractors();
  }, []);

  const loadContractors = async () => {
    try {
      const res = await fetch('/api/contractors');
      const data = await res.json();
      if (data.success) setContractors(data.contractors || []);
    } catch (err) {
      console.error('Failed fetching contractors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddContractor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/contractors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractorName,
          serviceProvided,
          monthlyPayment: parseFloat(monthlyPayment) || 0,
          hasFixedHours,
          usesCompanyEquipment,
          isExclusive,
          hasDirectSupervision
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setContractorName('');
        setServiceProvided('');
        await loadContractors();
      }
    } catch (err) {
      console.error('Error adding contractor:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-slate-400 text-sm animate-pulse">Evaluating DOLE Contractor Classification...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Contractor Compliance & DOLE Classification Check</h1>
              <p className="text-xs text-slate-400">
                Evaluate independent contractor relationships under the Supreme Court & DOLE 4-Fold Control Test and track BIR Form 2307 withholding.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Contractor & Check Risk
          </button>
        </div>
      </div>

      {/* Mandatory DOLE Legal Warning Callout */}
      <div className="p-5 rounded-2xl glass-panel border border-amber-500/40 bg-amber-950/20 space-y-2">
        <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>MANDATORY LEGAL PRINCIPLE: DOLE FOUR-FOLD TEST</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Under Philippine Labor Law (Supreme Court jurisprudence), independent contractor status depends on the <strong className="text-white">actual operational facts</strong>, not merely the title or wording of a contract. If FlowForceRM exercises direct control over the means and methods of work, DOLE may reclassify the relationship as regular employment, triggering retroactive SSS, PhilHealth, Pag-IBIG, and 13th month pay obligations.
        </p>
      </div>

      {/* Contractor List */}
      <div className="space-y-4">
        {contractors.map((c) => {
          const isHighRisk = c.riskLevel === 'HIGH_EMPLOYEE_RISK';
          return (
            <div key={c.id} className={`p-5 rounded-2xl glass-card border space-y-3 ${
              isHighRisk ? 'border-red-500/50 bg-red-950/20' : 'border-slate-800'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-base text-white">{c.contractorName}</h3>
                    <span className="text-xs text-slate-400 font-mono">[{c.agreementType}]</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{c.serviceProvided}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    ₱{c.monthlyPayment?.toLocaleString()}/mo
                  </span>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    isHighRisk ? 'bg-red-950 text-red-400 border border-red-800' :
                    c.riskLevel === 'MEDIUM' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                    'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {isHighRisk ? 'PROFESSIONAL REVIEW REQUIRED' : 'LOW EMPLOYEE RISK'}
                  </span>
                </div>
              </div>

              {/* Control Score Indicator */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>DOLE Operational Control Score:</span>
                  <span className="font-bold font-mono text-white">{c.doleControlScore} / 100</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      isHighRisk ? 'bg-red-500' : c.riskLevel === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(10, c.doleControlScore))}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-400">
                  {c.notes || (isHighRisk 
                    ? 'WARNING: Operational parameters show strong employer control over means/methods. High risk of DOLE employment reclassification.'
                    : 'Independent contractor status verified under Supreme Court 4-Fold Test baseline.'
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Contractor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 max-w-lg w-full space-y-4 bg-slate-900">
            <h3 className="text-base font-bold text-white">Add Contractor & Evaluate Control Risk</h3>
            <form onSubmit={handleAddContractor} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Contractor / Agency Name</label>
                <input
                  type="text"
                  value={contractorName}
                  onChange={(e) => setContractorName(e.target.value)}
                  placeholder="e.g. Maria Santos (Marketing Freelancer)"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Services Provided</label>
                <input
                  type="text"
                  value={serviceProvided}
                  onChange={(e) => setServiceProvided(e.target.value)}
                  placeholder="e.g. SEO Copywriting & Content Creation"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Monthly Payment (₱)</label>
                <input
                  type="number"
                  value={monthlyPayment}
                  onChange={(e) => setMonthlyPayment(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              {/* 4-Fold Checkbox Factors */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-slate-200 block">DOLE 4-Fold Control Test Evaluation:</span>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasFixedHours}
                    onChange={(e) => setHasFixedHours(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700"
                  />
                  <span className="text-slate-300">Requires fixed mandatory working hours at specific location</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={usesCompanyEquipment}
                    onChange={(e) => setUsesCompanyEquipment(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700"
                  />
                  <span className="text-slate-300">Provided with company laptop, software tools, or equipment</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isExclusive}
                    onChange={(e) => setIsExclusive(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700"
                  />
                  <span className="text-slate-300">Contractor is prohibited from taking other clients (Exclusive)</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasDirectSupervision}
                    onChange={(e) => setHasDirectSupervision(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700"
                  />
                  <span className="text-slate-300">FlowForceRM directly dictates step-by-step process/method</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
                >
                  Save Contractor & Check Risk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
