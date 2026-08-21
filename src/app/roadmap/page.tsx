'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  HelpCircle, 
  ArrowRight, 
  ExternalLink,
  ShieldCheck,
  Building,
  FileText,
  Lock
} from 'lucide-react';

export default function RoadmapPage() {
  const [requirements, setRequirements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/requirements')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRequirements(data.requirements || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-slate-400 text-sm animate-pulse">Building Dynamic Registration Roadmap...</div>
      </div>
    );
  }

  const findReq = (code: string) => requirements.find(r => r.code === code);

  const roadmapSteps = [
    {
      stepNumber: 1,
      title: '1. Business Setup & Profile Definition',
      description: 'Define sole proprietorship parameters, home-based location, and SaaS business activity.',
      status: 'COMPLETED',
      fee: 0,
      agency: 'SYSTEM',
      details: 'FlowForceRM profile established with 8% Tax Option and Home-based Online SaaS classification.'
    },
    {
      stepNumber: 2,
      title: '2. DTI Business Name Registration (BNR)',
      description: 'Register trade name nationwide or citywide under the Business Name Law (Act 3883).',
      req: findReq('DTI_BNR'),
      icon: Building
    },
    {
      stepNumber: 3,
      title: '3. Barangay Clearance / Home Occupation Verification',
      description: 'Local Barangay Hall verification for home-based non-disruptive SaaS operations.',
      req: findReq('BARANGAY_CLEARANCE'),
      icon: HelpCircle
    },
    {
      stepNumber: 4,
      title: '4. LGU Mayor’s Permit & Local Business Tax (BPLO)',
      description: 'City Hall BPLO registration or Home Occupation permit clearance.',
      req: findReq('LGU_MAYORS_PERMIT'),
      icon: MapPin
    },
    {
      stepNumber: 5,
      title: '5. BIR Federal Tax Registration (Form 2303)',
      description: 'Receive Certificate of Registration from BIR Revenue District Office (RDO). Note: Annual P500 fee ABOLISHED starting 2024!',
      req: findReq('BIR_COR'),
      icon: FileText
    },
    {
      stepNumber: 6,
      title: '6. Books of Accounts & BIR Registered Invoices (EOPT Act)',
      description: 'Register columnar books and order BIR-registered Invoices under RA 11976.',
      req: findReq('BIR_INVOICING'),
      icon: FileText
    },
    {
      stepNumber: 7,
      title: '7. Data Privacy & Customer Trust (NPC DPA 2012)',
      description: 'Implement Privacy Policy and data security safeguards for subscriber account data.',
      req: findReq('NPC_PRIVACY_NOTICE'),
      icon: Lock
    },
    {
      stepNumber: 8,
      title: '8. Ongoing Compliance & Recurring Filings',
      description: 'Quarterly BIR 1701Q filings, annual LGU renewal, and contractor 2307 forms.',
      status: 'ONGOING',
      fee: 0,
      agency: 'BIR / LGU',
      details: 'Active compliance monitoring mode activated.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Interactive Registration Roadmap</h1>
            <p className="text-xs text-slate-400">
              Visual pipeline showing step-by-step registration progress for FlowForceRM from DTI to BIR and Ongoing Compliance.
            </p>
          </div>
        </div>
      </div>

      {/* Vertical Roadmap Timeline */}
      <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-8 my-6">
        {roadmapSteps.map((step, idx) => {
          const req = step.req;
          const isCompleted = step.status === 'COMPLETED' || req?.completionState === 'COMPLETED';
          const isVerification = req?.applicabilityStatus === 'NEEDS_VERIFICATION' || req?.applicabilityStatus === 'CONDITIONAL';

          return (
            <div key={idx} className="relative group">
              {/* Milestone Icon Bullet */}
              <div className={`absolute -left-[35px] top-1 w-8 h-8 rounded-full flex items-center justify-center border text-xs font-bold ${
                isCompleted 
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-400' 
                  : isVerification
                  ? 'bg-amber-950 border-amber-500 text-amber-400 animate-pulse'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}>
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.stepNumber}
              </div>

              {/* Card content */}
              <div className="p-5 rounded-2xl glass-card space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="font-bold text-sm text-white">{step.title}</h3>
                  
                  <div className="flex items-center space-x-2">
                    {req?.priority && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        req.priority === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {req.priority}
                      </span>
                    )}

                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      isCompleted ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      isVerification ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {isCompleted ? 'COMPLETED' : isVerification ? 'NEEDS VERIFICATION' : 'PENDING'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {step.description}
                </p>

                {req && (
                  <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Agency & Basis:</span>
                      <span className="text-slate-300 font-medium">{req.officialSource} ({req.legalBasis})</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Estimated Government Fee:</span>
                      <span className="text-emerald-400 font-bold">₱{req.estimatedFee?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                )}

                {req?.actionItem && (
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start space-x-2">
                    <ArrowRight className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Action Item: </strong>
                      {req.actionItem}
                    </div>
                  </div>
                )}

                {req?.officialSourceUrl && (
                  <div className="flex justify-end pt-1">
                    <a
                      href={req.officialSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[11px] text-blue-400 hover:underline"
                    >
                      Official Government Source <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
