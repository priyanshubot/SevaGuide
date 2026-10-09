import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Search, ShieldCheck, MapPin, FileCheck2, ArrowRight, ArrowLeft } from 'lucide-react';

export const About: React.FC = () => {
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
          <Building2 className="w-3.5 h-3.5" />
          <span>Citizen Guidance Platform</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About SevaGuide
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
          Empowering Indian citizens with clear requirements, pre-submission consistency checks, and local office discovery before they visit government counters.
        </p>
      </div>

      {/* Problem & Mission */}
      <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Our Mission: Ending Counter Confusion
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Millions of citizens visit Aadhaar Seva Kendras, RTO offices, and facilitation centers every day only to be turned away because of subtle spelling mismatches, missing address proofs, or outdated photocopies.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          SevaGuide was designed as a "prevention-first" civic companion. We do not issue documents or replace authorized portals. Instead, we ensure you have the exact required paperwork in hand, validated for common consistency errors, before you stand in line.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">The Four Pillars of SevaGuide</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-2 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">1. Know Requirements</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Transparent, up-to-date document checklists for Aadhaar, PAN, Passport, Certificates, and Driving Licences.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-2 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">2. Pre-Submission Check</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Browser-side OCR scans your physical paperwork to verify regex formatting and cross-check spelling before counter submission.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-2 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">3. Office Locator</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Find authorized Kendra locations, operational hours, distances, and contact details with interactive routing.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-2 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">4. Personal Vault</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Encrypted, user-scoped storage to keep your required documents organized across multi-step procedures.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Ready to prepare your documents?</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">Explore requirements across our complete government services directory.</p>
        </div>
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-xs shrink-0"
        >
          <span>Explore Services</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
