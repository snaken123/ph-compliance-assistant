'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight } from 'lucide-react';

function ActivateContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  return (
    <div className="max-w-md w-full p-8 rounded-3xl glass-panel border border-emerald-500/40 bg-slate-900/90 space-y-6 text-center shadow-2xl">
      <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <h1 className="text-xl font-bold text-white">Account Successfully Activated!</h1>
      
      <p className="text-xs text-slate-300 leading-relaxed">
        Welcome to FlowForceRM Compliance Manager, <strong className="text-white">stephen.rey@salazar-group.net</strong>. Your account has been activated. Please proceed to sign in and set your permanent password.
      </p>

      <Link
        href="/login"
        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition inline-flex items-center justify-center space-x-2"
      >
        <span>Proceed to Sign In</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default function ActivatePage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10 px-4">
      <Suspense fallback={<div className="text-slate-400 text-xs">Loading activation page...</div>}>
        <ActivateContent />
      </Suspense>
    </div>
  );
}
