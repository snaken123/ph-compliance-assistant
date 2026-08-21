'use client';

import React, { useEffect, useState } from 'react';
import { History, ShieldCheck, FileText, UserCheck, Activity } from 'lucide-react';

export default function AuditPage() {
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/audit')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAuditLogs(data.auditLogs || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-slate-400 text-sm animate-pulse">Loading Immutable Compliance Audit Trail...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Compliance Audit Trail & History</h1>
            <p className="text-xs text-slate-400">
              Immutable record of all profile changes, status updates, document uploads, payments, and government inquiries.
            </p>
          </div>
        </div>
      </div>

      {/* Audit Log Feed */}
      <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-4 my-4">
        {auditLogs.map((log) => (
          <div key={log.id} className="relative group">
            <div className="absolute -left-[31px] top-1.5 w-6 h-6 rounded-full bg-slate-900 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Activity className="w-3 h-3" />
            </div>

            <div className="p-4 rounded-xl glass-card border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 font-mono">
                  {log.action}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>

              <p className="text-xs text-slate-200">{log.description}</p>
              
              <div className="text-[10px] text-slate-500 font-mono">
                Entity: {log.entityType} ({log.entityId})
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
