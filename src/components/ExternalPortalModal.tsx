import React from 'react';
import { ExternalLink, ShieldCheck, X } from 'lucide-react';

interface ExternalPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  portalName: string;
  portalUrl: string;
}

export const ExternalPortalModal: React.FC<ExternalPortalModalProps> = ({
  isOpen,
  onClose,
  portalName,
  portalUrl,
}) => {
  if (!isOpen) return null;

  let domain = '';
  try {
    const parsed = new URL(portalUrl);
    domain = parsed.hostname;
  } catch {
    domain = portalUrl;
  }

  const handleProceed = () => {
    window.open(portalUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="external-portal-modal-title"
    >
      <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3
                id="external-portal-modal-title"
                className="font-bold text-lg sm:text-xl text-slate-900 dark:text-white"
              >
                You're leaving SevaGuide
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Official external destination verification
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          You are about to visit an external government website. Check the website address and confirm
          it is official before entering personal information or uploading documents.
        </p>

        {/* Destination preview box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {portalName || 'Official Portal'}
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
              <ShieldCheck className="w-3 h-3" />
              Verified Destination
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Official Domain:{' '}
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {domain}
              </span>
            </p>
            <p className="font-mono text-[11px] text-blue-600 dark:text-blue-400 truncate">
              {portalUrl}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-900 font-semibold text-xs transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleProceed}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm hover:shadow transition cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <span>Continue to Official Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
