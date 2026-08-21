'use client';

import React, { useEffect, useState } from 'react';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ExternalLink, 
  FileText, 
  Upload, 
  ChevronDown, 
  ChevronUp,
  ShieldCheck,
  Building2,
  DollarSign,
  HelpCircle,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CalculatedRequirement } from '@/lib/compliance/types';

export default function RequirementsPage() {
  const [requirements, setRequirements] = useState<CalculatedRequirement[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [expandedCode, setExpandedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadRequirements();
    loadDocuments();
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

  const loadDocuments = async () => {
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      if (data.success) setDocuments(data.documents || []);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  const updateStatus = async (id: string, newState: string, reqItem?: CalculatedRequirement) => {
    // Artifact Guard Validation for [HIGH-01]
    if (newState === 'COMPLETED' && reqItem) {
      const hasArtifact = documents.some((d) => d.requirementId === (reqItem as any).id || d.title.toLowerCase().includes(reqItem.agency.toLowerCase()));
      if (!hasArtifact) {
        const confirmWithoutArtifact = confirm(
          `⚠️ MANDATORY ARTIFACT ADVISORY:\nNo document proof artifact (e.g. PDF/Image certificate) has been uploaded for "${reqItem.title}".\n\nPhilippine statutory audit rules require keeping proof of compliance.\n\nDo you want to proceed marking this item as Completed anyway?`
        );
        if (!confirmWithoutArtifact) return;
      }
    }

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
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Philippine Statutory Compliance Matrix</h1>
              <p className="text-xs text-slate-400">
                Statutory requirement evaluation engine enforcing DTI Act 3883, Local Government Code RA 7160, NIRC, EOPT Act RA 11976, and DOLE DO 174.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex space-x-2 overflow-x-auto pt-2 scrollbar-none">
          {[
            { id: 'ALL', label: `All Requirements (${requirements.length})` },
            { id: 'REQUIRED', label: `Mandatory (${requirements.filter(r => r.applicabilityStatus === 'REQUIRED').length})` },
            { id: 'NEEDS_VERIFICATION', label: `Verification Needed (${requirements.filter(r => r.applicabilityStatus === 'NEEDS_VERIFICATION' || r.applicabilityStatus === 'CONDITIONAL').length})` },
            { id: 'COMPLETED', label: `Completed (${requirements.filter(r => r.completionState === 'COMPLETED').length})` },
            { id: 'NOT_APPLICABLE', label: `Exempt (${requirements.filter(r => r.applicabilityStatus === 'NOT_APPLICABLE').length})` },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
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
          const hasProofDoc = documents.some((d) => d.requirementId === (req as any).id || d.title.toLowerCase().includes(req.agency.toLowerCase()));

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
                    <span className="text-xs font-semibold text-slate-400 font-mono">{req.agency}</span>
                    {hasProofDoc && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center font-medium">
                        <FileText className="w-3 h-3 mr-1" /> Doc Attached
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-tight">{req.title}</h3>
                  <p className="text-xs text-slate-300 line-clamp-1">{req.description}</p>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <select
                    value={req.completionState}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateStatus((req as any).id || req.code, e.target.value, req)}
                    disabled={updatingId === ((req as any).id || req.code)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                      isCompleted 
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                        : 'bg-slate-900 text-slate-200 border-slate-700'
                    }`}
                  >
                    <option value="NOT_STARTED">Not Started</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="SUBMITTED">Submitted to Agency</option>
                    <option value="COMPLETED">Completed ✓</option>
                    <option value="WAIVED">Waived / Exempt</option>
                  </select>

                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Drawer Content */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-4 text-xs">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="font-bold text-blue-400 block">Why It Applies To You:</span>
                      <p className="text-slate-300 leading-relaxed">{req.whyItApplies}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="font-bold text-amber-400 block">Exemption / Non-Applicability Criteria:</span>
                      <p className="text-slate-300 leading-relaxed">{req.whyItMightNotApply}</p>
                    </div>
                  </div>

                  {/* Legal Basis & Official Portal Link */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div>
                      <span className="text-slate-400 font-mono text-[11px] block">Legal Basis:</span>
                      <span className="text-slate-200 font-medium">{req.legalBasis}</span>
                    </div>

                    <a
                      href={req.officialSourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold transition flex items-center space-x-1.5 self-start sm:self-center"
                    >
                      <span>Official Portal ({req.officialSource})</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
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
