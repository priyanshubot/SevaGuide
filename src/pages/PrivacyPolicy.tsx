import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Database, Cpu, Trash2, AlertTriangle, ArrowLeft } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
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
          <Lock className="w-3.5 h-3.5" />
          <span>Transparency & Privacy Notice</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Privacy Policy & Data Handling
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Last updated: October 2026. This policy describes how SevaGuide collects, processes, and protects your information.
        </p>
      </div>

      {/* Important Clarification Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Non-Governmental Environment Notice:</strong> SevaGuide is an independent civic-tech platform. We do not transmit your documents to government departments or external commercial advertisers. All processing disclosures below reflect our actual technical implementation.
        </p>
      </div>

      {/* Policy Sections */}
      <div className="space-y-6">
        {/* Section 1: Data We Collect */}
        <section className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5 text-blue-700 dark:text-blue-400">
            <Database className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Data We Collect</h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            SevaGuide collects only the information necessary to provide guidance and pre-submission document verification:
          </p>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
            <li><strong>Account Profile:</strong> When registering, we store your email address, unique account identifier (UID), and optional profile preferences (full name, state, and district) in the <code>public.profiles</code> table.</li>
            <li><strong>Uploaded Document Files:</strong> Image or PDF files that you choose to upload for pre-submission checks.</li>
            <li><strong>Extracted Verification Fields:</strong> Extracted document metadata (such as PAN number, cardholder name, or birth date) parsed during verification.</li>
          </ul>
        </section>

        {/* Section 2: Browser-Side OCR Processing */}
        <section className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5 text-blue-700 dark:text-blue-400">
            <Cpu className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Browser-Side OCR Processing</h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Optical Character Recognition (OCR) is performed directly inside your browser using <strong>Tesseract.js</strong> running in a client-side Web Worker.
          </p>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
            <li>Text extraction happens on your device without passing raw image data to third-party AI vision APIs.</li>
            <li>Pattern validation rules (e.g. verifying Indian PAN regex structures) run locally in client-side TypeScript.</li>
            <li>Personal data extracted during OCR is never logged to public browser consoles or third-party analytical trackers.</li>
          </ul>
        </section>

        {/* Section 3: Supabase Storage & Database Security */}
        <section className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5 text-blue-700 dark:text-blue-400">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Storage & Access Controls</h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            When you are authenticated and choose to save verified documents to your vault:
          </p>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
            <li>Files are uploaded to a Supabase Storage bucket scoped to your user account (<code>documents/{'{user_id}'}/...</code>).</li>
            <li>Document metadata is recorded in the <code>public.documents</code> table protected by <strong>Row-Level Security (RLS)</strong> policies.</li>
            <li>Under RLS policies, only the authenticated user owning the record is permitted to view, update, or delete that document.</li>
            <li>Access security relies upon Supabase authentication tokens; if you sign out or clear session tokens, unauthenticated requests are blocked by database policies.</li>
          </ul>
        </section>

        {/* Section 4: Data Deletion & User Rights */}
        <section className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5 text-blue-700 dark:text-blue-400">
            <Trash2 className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Data Deletion & User Control</h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            You maintain full control over your saved records:
          </p>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
            <li><strong>Delete Documents:</strong> You can delete any uploaded document at any time directly from the Document Verification screen or Profile page. Deletion removes the storage object and database record.</li>
            <li><strong>Local State:</strong> Document readiness checklist selections stored in your browser's <code>localStorage</code> can be reset using the "Reset Checklist" button or by clearing site data.</li>
            <li><strong>Account Sign-Out:</strong> Signing out terminates your active session token immediately.</li>
          </ul>
        </section>
      </div>

      {/* Footer Navigation Back Link */}
      <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 flex justify-between items-center text-xs text-slate-500">
        <span>Questions about data privacy? Reach out via our <Link to="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">Contact page</Link>.</span>
        <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Use &rarr;</Link>
      </div>
    </div>
  );
};
