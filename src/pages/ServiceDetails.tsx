import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { SERVICES_DATA } from '../data/services';
import { ServiceWorkflowSteps } from '../components/ServiceWorkflowSteps';
import { DocumentChecklist } from '../components/DocumentChecklist';
import { VerifyDocuments } from './VerifyDocuments';
import { SubmissionModeStep } from '../components/SubmissionModeStep';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Banknote,
  AlertTriangle,
  CheckCircle2,
  X,
  ExternalLink,
  FileCheck2,
} from 'lucide-react';

interface ServiceDetailsProps {
  initialStep?: number;
}

export const ServiceDetails: React.FC<ServiceDetailsProps> = ({ initialStep }) => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const stepParam = searchParams.get('step') || (initialStep ? initialStep.toString() : null);

  const service = SERVICES_DATA.find((s) => s.id === serviceId);

  // Storage key specific to this service for checklist persistence
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
      // ignore
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
      // ignore
    }
  }, [checkedMap, storageKey]);

  // Warning modal state when continuing with missing mandatory documents
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);

  if (!service) {
    return (
      <div className="max-w-xl mx-auto my-16 text-center space-y-4 bg-white dark:bg-black p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Service Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          The requested government service does not exist or has been updated.
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

  // Calculate readiness counts for Step 1
  const totalDocs = service.requiredDocuments.length;
  const readyDocs = service.requiredDocuments.filter((d) => Boolean(checkedMap[d.id]));
  const readyCount = readyDocs.length;
  const progressPercent = totalDocs > 0 ? Math.round((readyCount / totalDocs) * 100) : 0;

  const requiredDocs = service.requiredDocuments.filter((d) => d.required && !d.isConditional);
  const totalRequiredCount = requiredDocs.length;
  const readyRequiredCount = requiredDocs.filter((d) => Boolean(checkedMap[d.id])).length;
  const missingRequiredDocs = requiredDocs.filter((d) => !checkedMap[d.id]);
  const hasUncheckedRequired = missingRequiredDocs.length > 0;

  // Handlers for Step 1 Checklist
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

  const handleContinueClick = () => {
    if (hasUncheckedRequired) {
      setShowIncompleteWarning(true);
    } else {
      setSearchParams({ step: '2' });
    }
  };

  // =========================================================================
  // STEP 2: UPLOAD & VERIFY DOCUMENTS
  // =========================================================================
  if (stepParam === '2') {
    return (
      <VerifyDocuments
        serviceIdProp={service.id}
        onBackToStep1={() => setSearchParams({ step: '1' })}
        onContinueToStep3={() => setSearchParams({ step: '3' })}
      />
    );
  }

  // =========================================================================
  // STEP 3: CHOOSE ONLINE OR OFFLINE
  // =========================================================================
  if (stepParam === '3') {
    return (
      <div className="space-y-6">
        <ServiceWorkflowSteps
          currentStep={3}
          onStepClick={(step) => {
            if (step === 1) setSearchParams({ step: '1' });
            if (step === 2) setSearchParams({ step: '2' });
          }}
        />
        <SubmissionModeStep
          service={service}
          onBack={() => setSearchParams({ step: '2' })}
          onHome={() => navigate('/services')}
        />
      </div>
    );
  }

  // =========================================================================
  // STEP 1: DOCUMENT READINESS CHECKLIST (Checklist Only, Zero Uploads)
  // =========================================================================
  if (stepParam === '1') {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* 3-Step Workflow Progress Indicator */}
        <ServiceWorkflowSteps
          currentStep={1}
          onStepClick={(step) => {
            if (step === 2) handleContinueClick();
            if (step === 3) setSearchParams({ step: '3' });
          }}
        />

        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-700 dark:text-slate-400 dark:hover:text-blue-400 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Service Summary</span>
            </button>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-900">
              {service.category}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {service.name} Checklist
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Confirm the physical papers or scans you have on hand before verification.
          </p>
        </div>

        {/* Checklist Container */}
        <div className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* Progress Summary */}
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
                  Mandatory documents:{' '}
                  <strong className="text-slate-800 dark:text-slate-200">
                    {readyRequiredCount} of {totalRequiredCount} ready
                  </strong>
                  {missingRequiredDocs.length > 0 && (
                    <span className="text-amber-600 dark:text-amber-400 font-medium ml-1.5">
                      ({missingRequiredDocs.length} mandatory still needed)
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
                  {progressPercent}% Prepared
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

          {/* Checklist Rows - Clean, checklist only, zero uploads */}
          <DocumentChecklist
            documents={service.requiredDocuments}
            checkedMap={checkedMap}
            onToggle={handleToggle}
            onSelectAll={handleSelectAll}
            onReset={handleReset}
          />

          {/* Action Footer */}
          <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-900 font-semibold text-xs transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Summary</span>
            </button>

            <button
              type="button"
              onClick={handleContinueClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-7 py-3.5 rounded-xl shadow-sm hover:shadow transition cursor-pointer"
            >
              <span>Continue to Document Verification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Missing Required Documents Warning Modal */}
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
                      Missing Mandatory Documents
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {missingRequiredDocs.length} mandatory document(s) marked as still needed
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
                  The following mandatory documents are not marked as ready:
                </p>
                <ul className="space-y-1 mt-2 list-disc list-inside text-amber-700 dark:text-amber-300 font-medium">
                  {missingRequiredDocs.map((doc) => (
                    <li key={doc.id}>{doc.name}</li>
                  ))}
                </ul>
                <p className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-zinc-800">
                  Official government application portals require all mandatory proofs. You can still proceed to test document verification.
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
                    setSearchParams({ step: '2' });
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Acknowledge & Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 0: INITIAL SERVICE DETAILS SUMMARY (Concise, Minimal, <= 15 Words)
  // =========================================================================
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb & Category */}
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-700 dark:text-slate-400 dark:hover:text-blue-400 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Government Services</span>
        </Link>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-900">
          {service.category}
        </span>
      </div>

      {/* Main Minimal Summary Card */}
      <div className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {service.name}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
            {service.description}
          </p>
        </div>

        {/* Metadata info badges (Fee & Processing Time only) */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100 dark:border-zinc-800 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          {service.fee && (
            <div className="flex items-center gap-2">
              <Banknote className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                Official Fee:{' '}
                <strong className="text-slate-900 dark:text-white font-semibold">
                  {service.fee}
                </strong>
              </span>
            </div>
          )}
          {service.fee && service.processingTime && (
            <span className="text-slate-300 dark:text-zinc-700">•</span>
          )}
          {service.processingTime && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                Processing Time:{' '}
                <strong className="text-slate-900 dark:text-white font-semibold">
                  {service.processingTime}
                </strong>
              </span>
            </div>
          )}
        </div>

        {/* Quick Actions Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-zinc-800">
          {service.officialPortalUrl ? (
            <a
              href={service.officialPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              <span>{service.officialPortalName || 'Official Source Portal'}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          ) : (
            <div />
          )}

          {/* Primary "Prepare My Documents" Button */}
          <button
            type="button"
            onClick={() => setSearchParams({ step: '1' })}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base px-8 py-3.5 rounded-2xl shadow-sm hover:shadow transition cursor-pointer"
          >
            <FileCheck2 className="w-5 h-5" />
            <span>Prepare My Documents</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};