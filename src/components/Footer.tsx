import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100 dark:bg-black border-t border-slate-200 dark:border-zinc-900 text-slate-600 dark:text-slate-400 text-sm py-8 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Link to="/" className="flex items-center hover:opacity-90 transition">
            <BrandLogo lightText={false} size="md" />
          </Link>

          <nav className="flex flex-wrap items-center gap-5 text-xs text-slate-700 dark:text-slate-300">
            <Link to="/services" className="hover:text-blue-700 dark:hover:text-emerald-400 transition">Services Directory</Link>
            <Link to="/offices" className="hover:text-blue-700 dark:hover:text-emerald-400 transition">Office Locator</Link>
            <Link to="/profile" className="hover:text-blue-700 dark:hover:text-emerald-400 transition">My Applications</Link>
          </nav>
        </div>

        {/* Official Guidance Disclaimer (Retained) */}
        <div className="bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 rounded-xl p-3 sm:p-4 flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <p>
            <strong>Official Guidance Disclaimer:</strong> SevaGuide provides pre-submission guidance; always verify current rules and fees directly with official government authorities.
          </p>
        </div>

        <div className="border-t border-slate-200 dark:border-zinc-900 pt-4 flex flex-col sm:flex-row justify-between text-[11px] text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} SevaGuide Civic-Tech Platform. Prototype Environment.</p>
          <p>Non-commercial civic assistance utility.</p>
        </div>
      </div>
    </footer>
  );
};