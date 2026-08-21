'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Send, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('stephen.rey@salazar-group.net');
  const [message, setMessage] = useState('');
  const [simulatedEmail, setSimulatedEmail] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setSimulatedEmail(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (data.success) {
        setMessage(data.message);
        if (data.simulatedEmail) {
          setSimulatedEmail(data.simulatedEmail);
        }
      }
    } catch (err: any) {
      setMessage('Failed to dispatch password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-md w-full p-8 rounded-3xl glass-panel border border-slate-800 bg-slate-900/90 space-y-6 shadow-2xl">
        
        <div className="flex items-center space-x-3">
          <Link href="/login" className="text-slate-400 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-white">Reset Password / Activation</h1>
        </div>

        <p className="text-xs text-slate-400">
          Enter your email address below. We will send an account activation link and password reset instructions.
        </p>

        {message && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Email Dispatched Successfully</span>
            </div>
            <p>{message}</p>
          </div>
        )}

        {/* Simulated Activation Email Inbox Box */}
        {simulatedEmail && (
          <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/40 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-blue-400 flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> SIMULATED EMAIL DISPATCH
              </span>
              <span className="text-[10px] text-slate-500 font-mono">To: {simulatedEmail.to}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Subject:</span>
              <span className="text-white font-medium">{simulatedEmail.subject}</span>
            </div>
            <div className="space-y-1 pt-1">
              <span className="text-slate-400 block text-[11px]">Activation & Password Reset Link:</span>
              <Link 
                href={simulatedEmail.resetLink} 
                className="text-blue-400 hover:underline font-mono break-all text-[11px] block"
              >
                {simulatedEmail.resetLink}
              </Link>
            </div>
          </div>
        )}

        <form onSubmit={handleRequestReset} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Dispatching...' : 'Send Activation & Reset Email'}</span>
          </button>
        </form>

      </div>
    </div>
  );
}
