'use client';

import React, { useEffect, useState } from 'react';
import { 
  PhoneCall, 
  Plus, 
  HelpCircle, 
  CheckCircle2, 
  Building2, 
  FileText,
  Calendar,
  MessageSquare
} from 'lucide-react';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);

  const [agency, setAgency] = useState('LGU');
  const [officeName, setOfficeName] = useState('');
  const [personContacted, setPersonContacted] = useState('');
  const [contactMethod, setContactMethod] = useState('PHONE');
  const [questionAsked, setQuestionAsked] = useState('');
  const [answerReceived, setAnswerReceived] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const res = await fetch('/api/contacts');
      const data = await res.json();
      if (data.success) setContacts(data.contacts || []);
    } catch (err) {
      console.error('Failed fetching government contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agency,
          officeName,
          personContacted,
          contactMethod,
          questionAsked,
          answerReceived,
          referenceNumber
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowLogModal(false);
        setOfficeName('');
        setQuestionAsked('');
        setAnswerReceived('');
        await loadContacts();
      }
    } catch (err) {
      console.error('Error logging contact:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-slate-400 text-sm animate-pulse">Loading Government Interaction History...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Government Interaction Log & Local Verification Trail</h1>
              <p className="text-xs text-slate-400">
                Document inquiries and official responses from Barangay Halls, BPLO, and BIR RDOs to maintain proof for conditional requirements.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Log Government Contact
          </button>
        </div>
      </div>

      {/* Log Feed */}
      <div className="space-y-4">
        {contacts.map((c) => (
          <div key={c.id} className="p-5 rounded-2xl glass-card border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800 font-mono">
                  [{c.agency}]
                </span>
                <h3 className="font-bold text-sm text-white">{c.officeName}</h3>
                {c.personContacted && (
                  <span className="text-xs text-slate-400">({c.personContacted})</span>
                )}
              </div>

              <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono">
                <span>Method: {c.contactMethod}</span>
                <span>Date: {new Date(c.dateContacted).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
              <div>
                <span className="text-slate-500 font-bold block text-[11px]">Question Asked:</span>
                <p className="text-slate-200">{c.questionAsked}</p>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-emerald-400 font-bold block text-[11px]">Government Answer / Outcome:</span>
                <p className="text-slate-300">{c.answerReceived}</p>
              </div>
            </div>

            {c.referenceNumber && (
              <div className="text-[11px] text-slate-400 font-mono">
                Reference / Ticket No: <strong className="text-slate-200">{c.referenceNumber}</strong>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 max-w-lg w-full space-y-4 bg-slate-900">
            <h3 className="text-base font-bold text-white">Log Government Interaction / LGU Inquiry</h3>
            <form onSubmit={handleLogSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Agency</label>
                  <select
                    value={agency}
                    onChange={(e) => setAgency(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    <option value="BARANGAY">Barangay Hall</option>
                    <option value="LGU">LGU / BPLO</option>
                    <option value="BIR">BIR RDO</option>
                    <option value="DTI">DTI Office</option>
                    <option value="NPC">National Privacy Commission</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Contact Method</label>
                  <select
                    value={contactMethod}
                    onChange={(e) => setContactMethod(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    <option value="PHONE">Phone Call</option>
                    <option value="EMAIL">Email Inquiry</option>
                    <option value="IN_PERSON">In-Person Visit</option>
                    <option value="WEBSITE">Website Portal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Office Name / Branch</label>
                <input
                  type="text"
                  value={officeName}
                  onChange={(e) => setOfficeName(e.target.value)}
                  placeholder="e.g. Quezon City BPLO Division"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Person Contacted / Officer</label>
                <input
                  type="text"
                  value={personContacted}
                  onChange={(e) => setPersonContacted(e.target.value)}
                  placeholder="e.g. Officer Santos"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Question Asked</label>
                <textarea
                  value={questionAsked}
                  onChange={(e) => setQuestionAsked(e.target.value)}
                  placeholder="e.g. Does a home-based online SaaS sole proprietor require a commercial clearance?"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white h-20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Answer Received / Instructions</label>
                <textarea
                  value={answerReceived}
                  onChange={(e) => setAnswerReceived(e.target.value)}
                  placeholder="e.g. Submit written Home Occupation Undertaking to BPLO Room 102."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white h-20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Reference / Ticket Number</label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="e.g. QC-BPLO-INQ-2026-881"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
                >
                  Save Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
