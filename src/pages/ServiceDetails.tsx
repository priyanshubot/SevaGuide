import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SERVICES_DATA } from '../data/services';
import { ProcessSteps } from '../components/ProcessSteps';
import { DocumentChecklist } from '../components/DocumentChecklist';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Clock,
  Banknote,
  Info,
  AlertTriangle,
  CheckCircle2,
  X,
} from 'lucide-react';

export const ServiceDetails: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const service = SERVICES_DATA.find((s) => s.id === serviceId);

  // Storage key specific to this service
  const storageKey = service ? `sevaguide_checklist_${service.id}` : '';

  // Initialize checklist state from localStorage
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>(() => {
    if (!storageKey) return {};
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore JSON parse errors
    }
    return {};
  });

  // Re-sync if serviceId changes
  useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCheckedMap(JSON.parse(saved));
      } else {
        setCheckedMap({});
      }
    } catch {
      setCheckedMap({});
    }
  }, [storageKey]);

  // Persist checklist state on every change
  useEffect(() => {
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(checkedMap));
    } catch {
      // storage unavailable / quota exceeded
    }
  }, [checkedMap, storageKey]);

  // Warning modal state when continuing with missing required documents
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);

  if (!service) {
    return (
      <div className="max-w-xl mx-auto my-16 text-center space-y-4 bg-white dark:bg-black p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Service Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          The requested civic facilitation service does not exist or has been moved.
        </p>
        <Link
          to="/services"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Services</span>
        </Link>
      </div>
    );
  }

  // Calculate readiness counts
  const totalDocs = service.requiredDocuments.length;
  const readyDocs = service.requiredDocuments.filter((d) => Boolean(checkedMap[d.id]));
  const readyCount = readyDocs.length;
  const progressPercent = totalDocs > 0 ? Math.round((readyCount / totalDocs) * 100) : 0;

  const requiredDocs = service.requiredDocuments.filter((d) => d.required);
  const totalRequiredCount = requiredDocs.length;
  const readyRequiredCount = requiredDocs.filter((d) => Boolean(checkedMap[d.id])).length;
  const missingRequiredDocs = requiredDocs.filter((d) => !checkedMap[d.id]);
  const hasUncheckedRequired = missingRequiredDocs.length > 0;

  // Handlers
  const handleToggle = (docId: string) => {
    setCheckedMap((prev) => ({
      ...prev,
      [docId]: !prev[docId],
    }));
  };

  const handleSelectAll = () => {
    const allChecked: Record<string, boolean> = {};
    service.requiredDocuments.forEach((d) => {
      allChecked[d.id] = true;
    });
    setCheckedMap(allChecked);
  };

  const handleReset = () => {
    setCheckedMap({});
  };

  const proceedToVerification = () => {
    navigate(`/verify/${service.id}`, {
      state: {
        checklistState: checkedMap,
        serviceId: service.id,
      },
    });
  };

  const handleContinueClick = () => {
    if (hasUncheckedRequired) {
      setShowIncompleteWarning(true);
    } else {
      proceedToVerification();
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* 1. Header & Breadcrumbs */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-700 dark:text-slate-400 dark:hover:text-blue-400 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Services</span>
          </Link>

          <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-900">
            {service.category}
          </span>
        </div>

        {/* 2. Service Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {service.name}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          {service.description}
        </p>

        {/* Metadata info badges: Fee & Processing time */}
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-4 pt-4 border-t border-slate-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-1.5">
            <Banknote className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <span>
              Official Fee:{' '}
              <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                {service.fee}
              </strong>
            </span>
          </div>
          <span className="text-slate-300 dark:text-zinc-700">•</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <span>
              Processing Time:{' '}
              <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                {service.processingTime}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Progress Steps Indicator (Step 0: Prepare Documents active) */}
      <ProcessSteps steps={service.steps} currentStepIndex={0} />

      {/* Main Checklist Card Container */}
      <div className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 transition-colors">
        {/* 3. Progress Summary */}
        <div className="space-y-3 pb-5 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {readyCount === totalDocs && totalDocs > 0 ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>All {totalDocs} documents ready!</span>
                  </>
                ) : (
                  <span>
                    {readyCount} of {totalDocs} documents ready
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Required documents:{' '}
                <strong className="text-slate-800 dark:text-slate-200">
                  {readyRequiredCount} of {totalRequiredCount} ready
                </strong>
                {missingRequiredDocs.length > 0 && (
                  <span className="text-amber-600 dark:text-amber-400 font-medium ml-1.5">
                    ({missingRequiredDocs.length} still needed)
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span
                className={`font-mono text-sm font-bold px-3 py-1 rounded-full ${
                  progressPercent === 100
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900'
                }`}
              >
                {progressPercent}% Complete
              </span>
            </div>
          </div>

          {/* Horizontal Progress Bar */}
          <div className="w-full bg-slate-100 dark:bg-zinc-900 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                progressPercent === 100 ? 'bg-emerald-600' : 'bg-blue-600'
              }`}
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        {/* 5. Warnings and Guidance */}
        <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 flex items-start gap-3 text-xs text-blue-900 dark:text-blue-200">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <p className="font-semibold text-blue-950 dark:text-blue-100">
              Readiness Checklist Guidance:
            </p>
            <p className="mt-0.5 text-blue-800 dark:text-blue-300">
              Document availability on this page is self-reported to help you organize your papers before applying.
              In Step 2, you will upload photos or scans of your documents to run an automated pre-submission consistency check.
            </p>
          </div>
        </div>

        {/* 4. Document Checklist (QueueLess style) */}
        <DocumentChecklist
          documents={service.requiredDocuments}
          checkedMap={checkedMap}
          onToggle={handleToggle}
          onSelectAll={handleSelectAll}
          onReset={handleReset}
        />

        {/* 6. Prominent Continue Button & Action Footer */}
        <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to={`/offices/${service.id}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-transparent dark:border-zinc-800 transition order-2 sm:order-1"
            >
              <MapPin className="w-4 h-4 text-slate-500" />
              <span>Find Nearest Office</span>
            </Link>

            <button
              type="button"
              onClick={handleContinueClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer order-1 sm:order-2"
            >
              <span>Continue to Document Verification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center">
            Step 1 of 5: Document Preparation • Next: In-Browser Verification & Cloud Vault
          </p>
        </div>
      </div>

      {/* Missing Required Documents Warning Modal / Dialog */}
      {showIncompleteWarning && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="warning-modal-title"
        >
          <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3
                    id="warning-modal-title"
                    className="font-bold text-lg text-slate-900 dark:text-white"
                  >
                    Missing Required Documents
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {missingRequiredDocs.length} required document(s) marked as still needed
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIncompleteWarning(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition"
                aria-label="Close warning"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-zinc-900/80 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                The following required documents are not marked as ready:
              </p>
              <ul className="space-y-1 mt-2 list-disc list-inside text-amber-700 dark:text-amber-300 font-medium">
                {missingRequiredDocs.map((doc) => (
                  <li key={doc.id}>{doc.name}</li>
                ))}
              </ul>
              <p className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-zinc-800">
                Government service portals will reject submissions without all mandatory proofs.
                You can still proceed if you want to test or verify the documents you currently have.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowIncompleteWarning(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-900 font-semibold text-xs transition cursor-pointer"
              >
                Review Checklist
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowIncompleteWarning(false);
                  proceedToVerification();
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Acknowledge & Continue Anyway</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};