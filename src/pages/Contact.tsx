import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ExternalLink, AlertCircle, ArrowLeft, MessageSquare, ShieldAlert } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Breadcrumb / Back button */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-700 dark:text-slate-400 dark:hover:text-blue-400 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-xs font-semibold uppercase tracking-wider">
          <Mail className="w-3.5 h-3.5" />
          <span>Support & Grievances</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Contact & Grievance Redressal
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
          Find the right channel for technical feedback on SevaGuide or lodging formal grievances regarding official government services.
        </p>
      </div>

      {/* Important Clarification Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Official Grievance Notice:</strong> SevaGuide is an independent civic-tech platform and cannot resolve pending government service applications, police verifications, or biometric rejections. For official grievances, please use the statutory government channels listed below.
        </p>
      </div>

      {/* Two Column Layout: Platform Feedback vs Official Helplines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Platform Feedback */}
        <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5 text-blue-700 dark:text-blue-400">
            <MessageSquare className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              SevaGuide Platform Feedback
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            For feedback regarding this prototype, error reporting on document checklists, or suggestions for improving guidance clarity:
          </p>
          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block">Interactive Feedback Form</span>
              <p className="text-slate-500 dark:text-slate-400">Submit your feedback directly in our validated feedback center.</p>
              <Link to="/feedback" className="inline-block mt-2 font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                Open Feedback Form &rarr;
              </Link>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block">Project Environment</span>
              <p className="text-slate-500 dark:text-slate-400">SevaGuide Open Source Civic-Tech Prototype developed for HackBios.</p>
            </div>
          </div>
        </div>

        {/* Card 2: Official Government Helplines */}
        <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-400">
            <ShieldAlert className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Official Government Helplines
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Statutory helplines and grievance portals operated by Government of India departments:
          </p>
          <div className="space-y-2.5 pt-1 text-xs">
            <a
              href="https://pgportal.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-between hover:border-slate-300 dark:hover:border-zinc-700 transition"
            >
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">CPGRAMS Central Portal</span>
                <span className="text-[11px] text-slate-500">Public Grievances (pgportal.gov.in)</span>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
            </a>

            <a
              href="https://resident.uidai.gov.in/grievance"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-between hover:border-slate-300 dark:hover:border-zinc-700 transition"
            >
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">UIDAI Aadhaar Helpline: 1947</span>
                <span className="text-[11px] text-slate-500">Toll-free / help@uidai.gov.in</span>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
            </a>

            <a
              href="https://www.passportindia.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-between hover:border-slate-300 dark:hover:border-zinc-700 transition"
            >
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Passport Seva: 1800-258-1800</span>
                <span className="text-[11px] text-slate-500">National Citizen Call Center</span>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
