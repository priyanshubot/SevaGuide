import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, AlertCircle, CheckCircle2, ArrowLeft, ExternalLink } from 'lucide-react';

export const TermsOfUse: React.FC = () => {
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 text-xs font-semibold uppercase tracking-wider">
          <Scale className="w-3.5 h-3.5" />
          <span>Platform Terms & Disclaimer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Terms of Use & Legal Disclaimer
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Please read these terms carefully before utilizing SevaGuide's citizen assistance tools.
        </p>
      </div>

      {/* Primary Highlighted Notice */}
      <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 space-y-2 text-xs text-amber-950 dark:text-amber-200">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-800 dark:text-amber-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Independent Platform Disclaimer</span>
        </div>
        <p className="leading-relaxed">
          SevaGuide is an independent civic-tech guidance platform. It is <strong>not an official government body, affiliated department, or authorized licensing agency</strong>. SevaGuide does not issue legal certificates, approve statutory applications, or replace designated government portals (such as UIDAI, Parivahan, Passport Seva, or Income Tax).
        </p>
      </div>

      {/* Terms Sections */}
      <div className="space-y-6">
        {/* Section 1: Preliminary Consistency Checks */}
        <section className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 space-y-3 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>1. Scope of Pre-Submission Verification</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            The document verification feature in SevaGuide conducts automated preliminary consistency checks (such as verifying character structures and standard regex patterns for PAN cards).
          </p>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
            <li>These checks are designed to help citizens identify common clerical errors (e.g. spelling mismatches or unreadable photocopies) prior to queuing at facilitation counters.</li>
            <li>A "Passed Check" status in SevaGuide does <strong>not</strong> constitute official government authentication or guarantee application approval by official scrutinizing officers.</li>
          </ul>
        </section>

        {/* Section 2: Variable Rules and Official Fees */}
        <section className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 space-y-3 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>2. Government Rules, Timelines & Fees Subject to Change</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Government service requirements, statutory fee schedules, valid document lists, and processing turnaround times are determined exclusively by authorized government ministries and state departments.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            While SevaGuide strives to maintain current, guide-backed information, citizens should always confirm statutory fees and final requirements directly on the official portal before initiating payment or booking appointments.
          </p>
        </section>

        {/* Section 3: User Responsibility */}
        <section className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 space-y-3 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. User Responsibility & Accurate Submissions
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Users are solely responsible for ensuring the accuracy and legitimacy of all information submitted to official government bodies. SevaGuide does not act as an agent, broker, or intermediary in processing applications.
          </p>
        </section>

        {/* Section 4: Non-Legal Advice */}
        <section className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 space-y-3 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. Informational Purpose (Not Legal Advice)
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            All content, checklists, guidance steps, and advisory notes provided by SevaGuide are for educational and informational assistance only. Nothing on this website constitutes legal counsel, immigration advice, or statutory representation.
          </p>
        </section>
      </div>

      {/* Official Portals Shortcut */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <span className="text-slate-600 dark:text-slate-300">
          Looking to access official government service portals directly?
        </span>
        <a
          href="https://www.myscheme.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <span>Visit myScheme Portal</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Footer Navigation Back Link */}
      <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 flex justify-between items-center text-xs text-slate-500">
        <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">&larr; Privacy Policy</Link>
        <Link to="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">Contact & Grievances &rarr;</Link>
      </div>
    </div>
  );
};
