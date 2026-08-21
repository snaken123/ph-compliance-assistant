'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CalendarDays, 
  FolderArchive, 
  TrendingUp, 
  CheckCircle2, 
  HelpCircle, 
  Clock, 
  ArrowRight, 
  Building2, 
  Calculator, 
  FileText,
  FileSearch,
  Sparkles,
  DollarSign,
  MapPin
} from 'lucide-react';

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [requirements, setRequirements] = useState<any[]>([]);
  const [deadlines, setDeadlines] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [profRes, reqRes, deadRes, docRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/requirements'),
          fetch('/api/deadlines'),
          fetch('/api/documents')
        ]);
        
        const profData = await profRes.json();
        const reqData = await reqRes.json();
        const deadData = await deadRes.json();
        const docData = await docRes.json();

        if (profData.success) setProfile(profData.profile);
        if (reqData.success) setRequirements(reqData.requirements || []);
        if (deadData.success) setDeadlines(deadData.deadlines || []);
        if (docData.success) setDocuments(docData.documents || []);
      } catch (err) {
        console.error('Failed loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-400">Loading FlowForceRM Compliance Dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate compliance statistics
  const applicableReqs = requirements.filter(r => r.applicabilityStatus !== 'NOT_APPLICABLE');
  const completedReqs = applicableReqs.filter(r => r.completionState === 'COMPLETED');
  const compliancePercentage = applicableReqs.length > 0 
    ? Math.round((completedReqs.length / applicableReqs.length) * 100)
    : 0;

  const criticalCount = applicableReqs.filter(r => r.priority === 'CRITICAL' && r.completionState !== 'COMPLETED').length;
  const highCount = applicableReqs.filter(r => r.priority === 'HIGH' && r.completionState !== 'COMPLETED').length;
  const mediumCount = applicableReqs.filter(r => r.priority === 'MEDIUM' && r.completionState !== 'COMPLETED').length;
  const verificationCount = applicableReqs.filter(r => r.applicabilityStatus === 'NEEDS_VERIFICATION' || r.applicabilityStatus === 'CONDITIONAL').length;

  const overdueDeadlines = deadlines.filter(d => d.isOverdue || d.status === 'OVERDUE');
  const nextDeadline = deadlines.find(d => d.status === 'PENDING' && !d.isOverdue);
  const expiringDocs = documents.filter(d => d.expirationStatus === 'EXPIRING_SOON' || d.expirationStatus === 'EXPIRED');

  const isOngoingMode = profile?.mode === 'ONGOING';

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">{profile?.businessName || 'FlowForceRM'}</h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-900/60 text-blue-300 border border-blue-700 font-mono">
              Sole Proprietorship • SaaS
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            {profile?.cityMunicipality}, {profile?.province} • Home-based Online SaaS • ₱{profile?.monthlyGrossReceipts?.toLocaleString()}/mo
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/tax-calculator"
            className="flex items-center px-3.5 py-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 text-xs font-semibold transition"
          >
            <Calculator className="w-4 h-4 mr-1.5" />
            Tax Simulator (8%)
          </Link>
          <Link
            href="/roadmap"
            className="flex items-center px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition"
          >
            <MapPin className="w-4 h-4 mr-1.5" />
            {isOngoingMode ? 'View Compliance Roadmap' : 'Continue Registration'}
          </Link>
        </div>
      </div>

      {/* Mode Banner */}
      {!isOngoingMode ? (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/80 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 animate-pulse" />
            <div>
              <span className="font-bold">REGISTRATION MODE ACTIVE:</span> Completing initial registration requirements for DTI, Barangay verification, LGU BPLO, and BIR Form 2303.
            </div>
          </div>
          <Link href="/settings" className="underline font-semibold hover:text-amber-100 flex-shrink-0">
            Switch to Ongoing Mode
          </Link>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/80 flex items-center justify-between text-xs text-emerald-200">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="font-bold">ONGOING COMPLIANCE MANAGER ACTIVE:</span> Initial setup complete! Tracking recurring BIR quarterly filings, annual LGU renewals, and contractor 2307 forms.
            </div>
          </div>
          <Link href="/calendar" className="underline font-semibold hover:text-emerald-100 flex-shrink-0">
            View Compliance Calendar
          </Link>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Overall Compliance Score */}
        <div className="p-5 rounded-2xl glass-card relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-400 font-medium">Overall Compliance</span>
              <div className="text-3xl font-extrabold text-white mt-1">{compliancePercentage}%</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${compliancePercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {completedReqs.length} of {applicableReqs.length} applicable requirements completed
          </p>
        </div>

        {/* Card 2: Urgent / Priority Requirements */}
        <div className="p-5 rounded-2xl glass-card">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-400 font-medium">Outstanding Actions</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-extrabold text-red-400">{criticalCount}</span>
                <span className="text-xs text-slate-400">Critical</span>
                <span className="text-xl font-bold text-amber-400">{highCount}</span>
                <span className="text-xs text-slate-400">High</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4 text-xs">
            <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-medium">
              {verificationCount} Needs Verification
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Home-based LGU & Barangay status requires local check</p>
        </div>

        {/* Card 3: Overdue & Next Deadline */}
        <div className="p-5 rounded-2xl glass-card">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-400 font-medium">Overdue & Upcoming</span>
              <div className="text-3xl font-extrabold text-amber-400 mt-1">
                {overdueDeadlines.length > 0 ? (
                  <span className="text-red-400">{overdueDeadlines.length} Overdue</span>
                ) : (
                  <span>0 Overdue</span>
                )}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-4 truncate font-medium">
            Next: {nextDeadline ? nextDeadline.title : 'All filings up to date!'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {nextDeadline ? `Due on ${new Date(nextDeadline.dueDate).toLocaleDateString()}` : 'No upcoming deadlines'}
          </p>
        </div>

        {/* Card 4: Tax Regime & Savings */}
        <div className="p-5 rounded-2xl glass-card">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-400 font-medium">Selected Tax Regime</span>
              <div className="text-xl font-extrabold text-emerald-400 mt-1">8% Gross Income Tax</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-300 mt-4 font-medium">
            ₱250,000 Annual Exemption Active
          </p>
          <p className="text-xs text-slate-400 mt-1">
            ₱0 Tax Due on ₱120k annual receipts
          </p>
        </div>

      </div>

      {/* Main Grid: Left Requirements & Verification Flow; Right: Upcoming Deadlines & Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section: Needs Local Verification Highlight */}
          {verificationCount > 0 && (
            <div className="p-5 rounded-2xl glass-panel border border-amber-500/30 bg-amber-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-amber-400">
                  <HelpCircle className="w-5 h-5" />
                  <h3 className="font-bold text-sm text-white">Action Required: Local Government Verification</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-900/80 text-amber-200 border border-amber-700">
                  NEEDS VERIFICATION
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Because <strong className="text-white">FlowForceRM</strong> is a home-based online SaaS operating in residential <strong className="text-white">{profile?.barangay}, {profile?.cityMunicipality}</strong>, national law grants LGUs discretion on whether standard commercial clearances or home occupation exemptions apply.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-amber-900/40 text-xs">
                <span className="text-amber-300 font-medium">Recommended Query: Contact Barangay Hall & BPLO</span>
                <Link
                  href="/contacts"
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 font-semibold transition"
                >
                  Log Local Inquiry →
                </Link>
              </div>
            </div>
          )}

          {/* Section: Prioritized Compliance List */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Priority Compliance Requirements</h3>
                <p className="text-xs text-slate-400">Filtered specifically for your business profile</p>
              </div>
              <Link href="/requirements" className="text-xs text-blue-400 hover:underline flex items-center font-medium">
                View All ({applicableReqs.length}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="space-y-3">
              {applicableReqs.slice(0, 5).map((req) => (
                <div 
                  key={req.code}
                  className="p-4 rounded-xl glass-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        req.priority === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' :
                        req.priority === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        'bg-blue-950 text-blue-400 border border-blue-800'
                      }`}>
                        {req.priority}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 font-mono">[{req.agency}]</span>
                      <h4 className="text-sm font-semibold text-white">{req.title}</h4>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-1">{req.reasoning || req.whyItApplies}</p>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <span className="text-xs text-slate-400 font-medium">
                      ₱{req.estimatedFee?.toLocaleString() || 0}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      req.applicabilityStatus === 'REQUIRED' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                      req.applicabilityStatus === 'NEEDS_VERIFICATION' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {req.applicabilityStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (1 Col wide) */}
        <div className="space-y-6">
          
          {/* Quick Actions Panel */}
          <div className="p-5 rounded-2xl glass-panel space-y-3">
            <h3 className="text-sm font-bold text-white">Compliance Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href="/tax-calculator"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 text-xs font-semibold text-slate-200 transition"
              >
                <div className="flex items-center space-x-2">
                  <Calculator className="w-4 h-4 text-emerald-400" />
                  <span>Simulate Revenue Tax (₱10k - ₱1M)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </Link>

              <Link
                href="/documents"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 text-xs font-semibold text-slate-200 transition"
              >
                <div className="flex items-center space-x-2">
                  <FolderArchive className="w-4 h-4 text-blue-400" />
                  <span>Upload Certificate / BIR Form 2303</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </Link>

              <Link
                href="/contractors"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 text-xs font-semibold text-slate-200 transition"
              >
                <div className="flex items-center space-x-2">
                  <FileSearch className="w-4 h-4 text-purple-400" />
                  <span>Run DOLE Contractor Risk Check</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </Link>
            </div>
          </div>

          {/* Upcoming Deadlines Widget */}
          <div className="p-5 rounded-2xl glass-panel space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center">
                <CalendarDays className="w-4 h-4 mr-1.5 text-amber-400" />
                Compliance Deadlines
              </h3>
              <Link href="/calendar" className="text-xs text-blue-400 hover:underline">
                View Calendar
              </Link>
            </div>

            <div className="space-y-3">
              {deadlines.slice(0, 3).map((d) => (
                <div key={d.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate max-w-[170px]">{d.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      d.isOverdue ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-blue-950 text-blue-300'
                    }`}>
                      {d.isOverdue ? 'OVERDUE' : new Date(d.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Agency: {d.agency} • Period: {d.period}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
