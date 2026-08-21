'use client';

import React, { useEffect, useState } from 'react';
import { 
  CalendarDays, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Bell, 
  BellRing,
  DollarSign,
  FileCheck
} from 'lucide-react';

export default function CalendarPage() {
  const [deadlines, setDeadlines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newAgency, setNewAgency] = useState('BIR');
  const [newDate, setNewDate] = useState('');
  const [newAmount, setNewAmount] = useState('0');

  useEffect(() => {
    loadDeadlines();
  }, []);

  const loadDeadlines = async () => {
    try {
      const res = await fetch('/api/deadlines');
      const data = await res.json();
      if (data.success) setDeadlines(data.deadlines || []);
    } catch (err) {
      console.error('Failed fetching deadlines:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const ref = prompt('Enter payment / confirmation reference number (optional):') || 'PAY-REF-2026';
      const res = await fetch(`/api/deadlines/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paymentReference: ref })
      });
      const data = await res.json();
      if (data.success) {
        await loadDeadlines();
      }
    } catch (err) {
      console.error('Failed to update deadline:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAddDeadline = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/deadlines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          agency: newAgency,
          dueDate: newDate,
          amount: parseFloat(newAmount) || 0
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setNewTitle('');
        await loadDeadlines();
      }
    } catch (err) {
      console.error('Failed creating deadline:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-slate-400 text-sm animate-pulse">Loading Escalating Compliance Calendar...</div>
      </div>
    );
  }

  const overdueList = deadlines.filter(d => d.isOverdue || d.status === 'OVERDUE');
  const upcomingList = deadlines.filter(d => !d.isOverdue && d.status !== 'COMPLETED' && d.status !== 'PAID');
  const completedList = deadlines.filter(d => d.status === 'COMPLETED' || d.status === 'PAID');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Compliance Calendar & Persistent Escalation Queue</h1>
              <p className="text-xs text-slate-400">
                Track statutory filing deadlines, renewals, tax payments, and persistent reminder escalations (30d → 14d → 7d → 3d → 1d → OVERDUE).
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Custom Deadline
          </button>
        </div>
      </div>

      {/* Escalation Alert Summary Banner */}
      {overdueList.length > 0 && (
        <div className="p-5 rounded-2xl glass-panel border border-red-500/50 bg-red-950/30 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-red-400">
              <BellRing className="w-5 h-5 animate-bounce" />
              <h3 className="font-bold text-sm text-white">ACTIVE ESCALATED OVERDUE ALERT ({overdueList.length})</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-950 text-red-300 border border-red-800">
              PERSISTENT REMINDERS ACTIVE
            </span>
          </div>
          <p className="text-xs text-red-200">
            Overdue tasks will continue triggering daily dashboard alerts until completed or officially marked waived.
          </p>
        </div>
      )}

      {/* Section 1: Overdue List */}
      {overdueList.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center">
            <AlertTriangle className="w-4 h-4 mr-1.5" /> Overdue Statutory Deadlines
          </h3>

          {overdueList.map((d) => (
            <div key={d.id} className="p-5 rounded-2xl glass-card border border-red-500/40 bg-red-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-400 border border-red-800 font-mono">
                    OVERDUE ({Math.abs(d.diffDays)} DAYS LATE)
                  </span>
                  <span className="text-xs font-semibold text-slate-400 font-mono">[{d.agency}]</span>
                  <h4 className="font-bold text-sm text-white">{d.title}</h4>
                </div>
                <p className="text-xs text-slate-300">{d.notes}</p>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <button
                  onClick={() => handleStatusUpdate(d.id, 'COMPLETED')}
                  disabled={updatingId === d.id}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition"
                >
                  Mark Filed / Paid ✓
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Section 2: Upcoming Deadlines */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center">
          <Clock className="w-4 h-4 mr-1.5" /> Upcoming Statutory Deadlines & Filings
        </h3>

        {upcomingList.length === 0 ? (
          <div className="p-6 rounded-2xl glass-card text-center text-slate-400 text-xs">
            No pending upcoming deadlines! All compliance filings are up to date.
          </div>
        ) : (
          upcomingList.map((d) => (
            <div key={d.id} className="p-5 rounded-2xl glass-card border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    d.diffDays <= 7 ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-blue-950 text-blue-400 border border-blue-800'
                  }`}>
                    DUE IN {d.diffDays} DAYS
                  </span>
                  <span className="text-xs font-semibold text-slate-400 font-mono">[{d.agency}]</span>
                  <h4 className="font-bold text-sm text-white">{d.title}</h4>
                </div>
                <p className="text-xs text-slate-300">{d.notes}</p>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <span className="text-xs text-slate-400 font-mono">
                  Due: {new Date(d.dueDate).toLocaleDateString()}
                </span>

                <button
                  onClick={() => handleStatusUpdate(d.id, 'COMPLETED')}
                  disabled={updatingId === d.id}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
                >
                  Mark Completed
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Section 3: Completed Deadlines */}
      {completedList.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-800/80">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Completed Compliance History
          </h3>

          {completedList.map((d) => (
            <div key={d.id} className="p-4 rounded-xl glass-card border border-slate-800/60 opacity-80 flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white line-through">{d.title}</h4>
                <p className="text-[11px] text-slate-400">Ref: {d.paymentReference || 'N/A'} • Submitted on {new Date(d.submittedAt || d.dueDate).toLocaleDateString()}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                COMPLETED ✓
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Add Custom Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 max-w-md w-full space-y-4 bg-slate-900">
            <h3 className="text-base font-bold text-white">Add Custom Statutory Deadline</h3>
            <form onSubmit={handleAddDeadline} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Requirement Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. BIR Form 1701Q Q3 Filing"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Government Agency</label>
                <select
                  value={newAgency}
                  onChange={(e) => setNewAgency(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="BIR">BIR (Bureau of Internal Revenue)</option>
                  <option value="DTI">DTI (Dept of Trade & Industry)</option>
                  <option value="LGU">LGU / BPLO</option>
                  <option value="BARANGAY">Barangay</option>
                  <option value="NPC">National Privacy Commission</option>
                  <option value="SSS">SSS</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Due Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  required
                />
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
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
                >
                  Create Deadline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
