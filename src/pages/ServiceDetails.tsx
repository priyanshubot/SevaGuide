import React, { useState, useEffect, useRef } from 'react';
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
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  FileCheck2,
  Building2,
  CheckCircle,
} from 'lucide-react';

export const ServiceDetails: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const service = SERVICES_DATA.find((s) => s.id === serviceId);

  const checklistRef = useRef<HTMLDivElement>(null);

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

  // Warning modal state when continuing with missing required documents
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

  // Calculate readiness counts
  const totalDocs = service.requiredDocuments.length;
  const readyDocs = service.requiredDocuments.filter((d) => Boolean(checkedMap[d.id]));
  const readyCount = readyDocs.length;
  const progressPercent = totalDocs > 0 ? Math.round((readyCount / totalDocs) * 100) : 0;

  const requiredDocs = service.requiredDocuments.filter((d) => d.required && !d.isConditional);
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

  const scrollToPreparation = () => {
    if (checklistRef.current) {
      checklistRef.current.scrollIntoView({ behavior: 'smooth' });
    }
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
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* 1. Header & Breadcrumbs */}
      <div className="space-y-4">
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

        {/* 2. Service Title & Summary */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {service.name}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
            {service.description}
          </p>
        </div>

        {/* Metadata info badges & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
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

          <div className="flex items-center gap-3 flex-wrap">
            {/* Prominent Prepare My Documents Button */}
            <button
              type="button"
              onClick={scrollToPreparation}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Prepare My Documents</span>
            </button>

            {/* Official Portal External Link */}
            {service.officialPortalUrl && (
              <a
                href={service.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-zinc-800 transition"
              >
                <span>{service.officialPortalName || 'Official Portal'}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Progress Steps Indicator */}
      <ProcessSteps steps={service.steps} currentStepIndex={0} />

      {/* Variable Requirements Notice */}
      {service.conditionalNotice && (
        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 flex items-start gap-3 text-xs text-amber-950 dark:text-amber-200">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <p className="font-bold text-amber-950 dark:text-amber-100">
              Notice on Variable & Conditional Requirements:
            </p>
            <p className="mt-0.5 text-amber-900 dark:text-amber-300">
              {service.conditionalNotice}
            </p>
          </div>
        </div>
      )}

      {/* Eligibility Information Section */}
      {service.eligibilitySummary && service.eligibilitySummary.length > 0 && (
        <div className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-zinc-800">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Eligibility & Applicant Conditions
            </h2>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {service.eligibilitySummary.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Step-by-Step Application Process */}
      {service.stepDetails && service.stepDetails.length > 0 && (
        <div className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Step-by-Step Application Process
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              {service.stepDetails.length} steps
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {service.stepDetails.map((s) => (
              <div
                key={s.step}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800 space-y-1"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                    {s.step}
                  </span>
                  <h4 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {s.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 pl-7 leading-relaxed">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Office & Assistance Information */}
      {service.officeAssistanceInfo && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300">
          <Building2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-slate-900 dark:text-white">In-Person Assistance & Official Centres: </span>
            <span>{service.officeAssistanceInfo}</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. PAGE 1: DOCUMENT READINESS CHECKLIST (QueueLess Inspired)             */}
      {/* ========================================================================= */}
      <div
        id="checklist"
        ref={checklistRef}
        className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 transition-colors"
      >
        {/* Progress Summary */}
        <div className="space-y-3 pb-5 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                  Step 1: Document Readiness
                </span>
              </div>
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
                    ({missingRequiredDocs.length} required still needed)
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

        {/* Guidance Reminder */}
        <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 flex items-start gap-3 text-xs text-blue-900 dark:text-blue-200">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <p className="font-semibold text-blue-950 dark:text-blue-100">
              Readiness Checklist Guidance:
            </p>
            <p className="mt-0.5 text-blue-800 dark:text-blue-300">
              Document readiness on this page is self-reported to help you confirm all physical papers or scans are on hand before filing.
              In Step 2 (Document Verification), you can upload documents to your encrypted vault and run automated pre-submission consistency checks.
            </p>
          </div>
        </div>

        {/* Checklist Rows (Still Needed & Ready Groups) */}
        <DocumentChecklist
          documents={service.requiredDocuments}
          checkedMap={checkedMap}
          onToggle={handleToggle}
          onSelectAll={handleSelectAll}
          onReset={handleReset}
        />

        {/* Action Footer */}
        <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to={`/offices/${service.id}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-transparent dark:border-zinc-800 transition order-2 sm:order-1"
            >
              <MapPin className="w-4 h-4 text-slate-500" />
              <span>Find Nearest Facilitation Office</span>
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
            Step 1 of 5: Document Preparation • Next: Document Upload, OCR Pre-Check & Cloud Vault
          </p>
        </div>
      </div>

      {/* Important Notes & Legal Disclaimers */}
      {service.importantNotes && service.importantNotes.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
          <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>Important Notes for Applicants:</span>
          </p>
          <ul className="space-y-1 list-disc list-inside text-slate-600 dark:text-slate-400">
            {service.importantNotes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
          {service.disclaimer && (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-200 dark:border-zinc-800">
              {service.disclaimer}
            </p>
          )}
        </div>
      )}

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
                Official government application portals will reject submissions without all mandatory proofs.
                You can still proceed if you want to test or verify documents you currently have available.
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