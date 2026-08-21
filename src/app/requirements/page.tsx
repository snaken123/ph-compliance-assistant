'use client';

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  ClipboardList, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Award
} from 'lucide-react';

export default function RequirementsPage() {
  const [requirements, setRequirements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [expandedCode, setExpandedCode] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadRequirements();
  }, []);

  const loadRequirements = async () => {
    try {
      const res = await fetch('/api/requirements');
      const data = await res.json();
      if (data.success) setRequirements(data.requirements || []);
    } catch (err) {
      console.error('Failed to fetch requirements:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newState: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/requirements/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completionState: newState })
      });
      const data = await res.json();
      if (data.success) {
        if (newState === 'COMPLETED') {
          // Trigger celebration confetti on task completion
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
        await loadRequirements();
      }
    } catch (err) {
      console.error('Failed to update requirement:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-slate-400 text-sm animate-pulse">Loading Statutory Requirement Matrix...</div>
        </div>
      </div>
    );
  }

  const filteredRequirements = requirements.filter((req) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'REQUIRED') return req.applicabilityStatus === 'REQUIRED';
    if (selectedFilter === 'NEEDS_VERIFICATION') return req.applicabilityStatus === 'NEEDS_VERIFICATION' || req.applicabilityStatus === 'CONDITIONAL';
    if (selectedFilter === 'NOT_APPLICABLE') return req.applicabilityStatus === 'NOT_APPLICABLE';
    if (selectedFilter === 'COMPLETED') return req.completionState === 'COMPLETED';
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Statutory Requirements & Legal Justifications</h1>
              <p className="text-xs text-slate-400">
                Understand WHY each Philippine legal requirement applies to FlowForceRM, whether it is mandatory, and consequences of non-compliance.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-800/80 text-xs">
          {[
            { id: 'ALL', label: `All Rules (${requirements.length})` },
            { id: 'REQUIRED', label: 'Mandatory / Required' },
            { id: 'NEEDS_VERIFICATION', label: 'Needs Verification' },
            { id: 'NOT_APPLICABLE', label: 'Not Applicable' },
            { id: 'COMPLETED', label: 'Completed ✓' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition ${
                selectedFilter === f.id
                  ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Requirement List */}
      <div className="space-y-4">
        {filteredRequirements.map((req) => {
          const isExpanded = expandedCode === req.code;
          const isCompleted = req.completionState === 'COMPLETED';
          const isNotApplicable = req.applicabilityStatus === 'NOT_APPLICABLE';
          const isNeedsVerification = req.applicabilityStatus === 'NEEDS_VERIFICATION';

          return (
            <div 
              key={req.code}
              className={`rounded-2xl glass-card border transition-all duration-300 ${
                isCompleted ? 'border-emerald-500/40 bg-emerald-950/10' :
                isExpanded ? 'border-blue-500/40 bg-slate-900/90 shadow-xl shadow-blue-500/5' : 'border-slate-800'
              }`}
            >
              {/* Main Summary Bar */}
              <div 
                onClick={() => setExpandedCode(isExpanded ? null : req.code)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold font-mono ${
                      req.priority === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' :
                      req.priority === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-blue-950 text-blue-400 border border-blue-800'
                    }`}>
                      {req.priority}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 font-mono">[{req.agency}]</span>
                    <h3 className="font-bold text-sm text-white">{req.title}</h3>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-1">
                    {req.notes || req.whyItApplies}
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold block shadow-sm ${
                      isCompleted ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      isNotApplicable ? 'bg-slate-800 text-slate-400 border border-slate-700' :
                      isNeedsVerification ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-blue-950 text-blue-300 border border-blue-800'
                    }`}>
                      {isCompleted ? 'COMPLETED ✓' : req.applicabilityStatus}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5 font-mono">
                      Fee: ₱{req.estimatedFee?.toLocaleString() || 0}
                    </span>
                  </div>

                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-blue-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  )}
                </div>
              </div>

              {/* Detailed Drawer */}
              {isExpanded && (
                <div className="p-6 border-t border-slate-800/80 space-y-5 bg-slate-950/60 rounded-b-2xl animate-fadeIn">
                  
                  {/* Grid 1: Why it applies / Why it might not apply */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/40 space-y-2">
                      <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center">
                        <HelpCircle className="w-4 h-4 mr-1.5" /> Why does this apply to me?
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {req.whyItApplies}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center">
                        <HelpCircle className="w-4 h-4 mr-1.5" /> Why might it NOT apply or be conditional?
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {req.whyItMightNotApply}
                      </p>
                    </div>
                  </div>

                  {/* Consequences & Penalties Section */}
                  <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 space-y-2">
                    <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center">
                      <ShieldAlert className="w-4 h-4 mr-1.5" /> What happens if I don't comply? (Consequences & Penalties)
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {req.consequencesAndPenalties}
                    </p>
                  </div>

                  {/* Legal Basis & Verification Metadata */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-500">Official Legal Basis: </span>
                      <strong className="text-slate-300">{req.legalBasis}</strong>
                    </div>

                    <div className="flex items-center space-x-3">
                      <a
                        href={req.officialSourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline inline-flex items-center font-medium"
                      >
                        {req.officialSource} <ExternalLink className="w-3.5 h-3.5 ml-1" />
                      </a>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                    <span className="text-xs text-slate-400 font-mono">
                      Date Verified: {req.dateVerified || '2026-08-01'}
                    </span>

                    <div className="flex items-center space-x-2">
                      {!isCompleted ? (
                        <button
                          onClick={() => updateStatus(req.id, 'COMPLETED')}
                          disabled={updatingId === req.id}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-lg shadow-emerald-600/20 flex items-center"
                        >
                          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                          Mark as Completed ✓
                        </button>
                      ) : (
                        <button
                          onClick={() => updateStatus(req.id, 'NOT_STARTED')}
                          disabled={updatingId === req.id}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition"
                        >
                          Reopen Task
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
