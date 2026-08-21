'use client';

import React, { useEffect, useState } from 'react';
import { 
  FolderArchive, 
  Upload, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  Plus, 
  Eye, 
  Lock
} from 'lucide-react';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [title, setTitle] = useState('');
  const [issuingAgency, setIssuingAgency] = useState('DTI');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      if (data.success) setDocuments(data.documents || []);
    } catch (err) {
      console.error('Failed fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          issuingAgency,
          referenceNumber,
          expirationDate: expirationDate || null
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowUploadModal(false);
        setTitle('');
        setReferenceNumber('');
        setExpirationDate('');
        await loadDocuments();
      }
    } catch (err) {
      console.error('Failed uploading document:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-slate-400 text-sm animate-pulse">Loading Document & Artifact Vault...</div>
      </div>
    );
  }

  const expiringSoon = documents.filter(d => d.expirationStatus === 'EXPIRING_SOON' || d.expirationStatus === 'EXPIRED');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <FolderArchive className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Document Vault & Expiration Alert Engine</h1>
              <p className="text-xs text-slate-400">
                Securely store government certificates (DTI, BIR 2303, LGU permits) and monitor automatic expiration alerts (90d, 60d, 30d, 14d, 7d).
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition self-start sm:self-auto"
          >
            <Upload className="w-4 h-4 mr-1.5" />
            Upload Government Certificate
          </button>
        </div>
      </div>

      {/* Security Privacy Notice */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center space-x-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>Private Document Storage — Encrypted Metadata & Signed URL Access Control (RA 10173 Compliant)</span>
        </div>
      </div>

      {/* Expiring Documents Banner */}
      {expiringSoon.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/80 space-y-1 text-xs text-amber-200">
          <div className="flex items-center space-x-2 font-bold text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <span>DOCUMENT EXPIRATION WARNING ({expiringSoon.length})</span>
          </div>
          <p className="text-slate-300">
            One or more uploaded certificates are expiring within 60 days. Prepare renewal documents with the respective agency.
          </p>
        </div>
      )}

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div key={doc.id} className="p-5 rounded-2xl glass-card border border-slate-800 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white line-clamp-1">{doc.title}</h3>
                  <span className="text-xs text-slate-400 font-mono">Agency: {doc.issuingAgency}</span>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                doc.expirationStatus === 'EXPIRED' ? 'bg-red-950 text-red-400 border border-red-800' :
                doc.expirationStatus === 'EXPIRING_SOON' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {doc.expirationStatus || 'VALID'}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Reference No:</span>
                <span className="text-slate-200 font-mono font-medium">{doc.referenceNumber || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Expiration Date:</span>
                <span className="text-slate-200 font-mono font-medium">
                  {doc.expirationDate ? new Date(doc.expirationDate).toLocaleDateString() : 'NO EXPIRATION'}
                </span>
              </div>
            </div>

            {doc.notes && (
              <p className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                {doc.notes}
              </p>
            )}

            <div className="flex justify-end pt-1">
              <button 
                onClick={() => alert(`Simulated secure preview for document: ${doc.title} (${doc.filePath})`)}
                className="text-xs text-blue-400 hover:underline inline-flex items-center font-medium"
              >
                <Eye className="w-3.5 h-3.5 mr-1" /> Secure Preview
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 max-w-md w-full space-y-4 bg-slate-900">
            <h3 className="text-base font-bold text-white">Upload Certificate / Artifact Metadata</h3>
            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Document Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. DTI Certificate of Business Name Registration"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Issuing Government Agency</label>
                <select
                  value={issuingAgency}
                  onChange={(e) => setIssuingAgency(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="DTI">DTI (Dept of Trade & Industry)</option>
                  <option value="BIR">BIR (Bureau of Internal Revenue)</option>
                  <option value="LGU">LGU / BPLO</option>
                  <option value="BARANGAY">Barangay</option>
                  <option value="CONTRACTOR">Contractor Agreement</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Official Reference Number</label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="e.g. BNR-2026-99120"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Expiration Date (Leave blank if none)</label>
                <input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold"
                >
                  Upload & Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
