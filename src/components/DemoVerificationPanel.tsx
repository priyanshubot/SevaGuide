import React, { useState } from 'react';
import {
  DEMO_SCENARIOS,
  DemoScenarioId,
  DemoItemVerification,
  DEMO_VERIFICATION_DISCLAIMER,
} from '../data/demoVerification';
import {
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Eye,
  ArrowRight,
  Upload,
  User,
  Info,
} from 'lucide-react';

interface DemoVerificationPanelProps {
  onPreviewDocument: (doc: {
    title: string;
    fileName: string;
    previewUrl: string;
    mimeType?: string;
  }) => void;
  onContinueToStep3?: () => void;
  onSwitchToManualUpload?: () => void;
  initialScenarioId?: DemoScenarioId;
  scenarioId?: DemoScenarioId;
  onScenarioChange?: (id: DemoScenarioId) => void;
}

export const DemoVerificationPanel: React.FC<DemoVerificationPanelProps> = ({
  onPreviewDocument,
  onContinueToStep3,
  onSwitchToManualUpload,
  initialScenarioId = 'scenario-a',
  scenarioId: controlledScenarioId,
  onScenarioChange,
}) => {
  const [internalScenarioId, setInternalScenarioId] = useState<DemoScenarioId>(initialScenarioId);
  const selectedScenarioId = controlledScenarioId || internalScenarioId;

  const scenario = DEMO_SCENARIOS[selectedScenarioId];
  const isPass = scenario.overallStatus === 'PASS';

  const handleSelectScenario = (id: DemoScenarioId) => {
    setInternalScenarioId(id);
    onScenarioChange?.(id);
  };

  const handleReset = () => {
    setInternalScenarioId('scenario-a');
    onScenarioChange?.('scenario-a');
  };

  return (
    <div className="space-y-6">
      {/* Demo Mode Header Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-blue-900/10 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-blue-950/40 rounded-3xl border border-blue-200 dark:border-blue-900/60 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  Interactive Demo Mode
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                  Predefined Metadata
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Aadhaar Document Verification Simulation
              </h2>
            </div>
          </div>

          {onSwitchToManualUpload && (
            <button
              type="button"
              onClick={onSwitchToManualUpload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition cursor-pointer self-start sm:self-auto"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Switch to Manual Vault Upload</span>
            </button>
          )}
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Evaluate how SevaGuide cross-checks applicant details against supporting documents.
          Select one of the two scenarios below to test automated consistency validation instantly.
        </p>

        {/* Applicant Profile Bar */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
          <span className="text-slate-500 dark:text-slate-400">Target Applicant Profile:</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 font-bold text-slate-900 dark:text-white">
            <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            {scenario.targetApplicant}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-900/60 text-slate-600 dark:text-slate-400 text-[11px]">
            <Info className="w-3 h-3 text-slate-400" />
            Simulated verification • Zero external AI transmission
          </span>
        </div>
      </div>

      {/* Scenario Selector Buttons */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
          Select Demo Scenario
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Button 1: Scenario A */}
          <button
            type="button"
            onClick={() => handleSelectScenario('scenario-a')}
            className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
              selectedScenarioId === 'scenario-a'
                ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-500 dark:border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                : 'bg-white dark:bg-black border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle
                  className={`w-4 h-4 ${
                    selectedScenarioId === 'scenario-a'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-400'
                  }`}
                />
                All Documents Match
              </span>
              <span
                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  selectedScenarioId === 'scenario-a'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                PASS • 3/3
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              POI, DOB, and POA all issued to Rahul Sharma. Perfect consistency.
            </p>
          </button>

          {/* Button 2: Scenario B */}
          <button
            type="button"
            onClick={() => handleSelectScenario('scenario-b')}
            className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
              selectedScenarioId === 'scenario-b'
                ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-500 dark:border-amber-500 shadow-sm ring-1 ring-amber-500'
                : 'bg-white dark:bg-black border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle
                  className={`w-4 h-4 ${
                    selectedScenarioId === 'scenario-b'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-slate-400'
                  }`}
                />
                Show Name Mismatch
              </span>
              <span
                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  selectedScenarioId === 'scenario-b'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                ATTENTION REQUIRED • 2/3
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Address utility bill issued to Prateek Agrawal instead of applicant Rahul Sharma.
            </p>
          </button>
        </div>
      </div>

      {/* Overall Verification Status Banner */}
      <div
        className={`p-5 sm:p-6 rounded-3xl border transition-colors shadow-xs ${
          isPass
            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
            : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div
              className={`p-3 rounded-2xl shrink-0 ${
                isPass
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-amber-600 text-white shadow-xs'
              }`}
            >
              {isPass ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                  Verification Result:
                </h3>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                    isPass
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  {scenario.overallStatus}
                </span>
                <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-lg bg-white/80 dark:bg-black/60 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-slate-200">
                  {scenario.matchedCount}/{scenario.totalCount} Documents Matched
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                {isPass
                  ? 'All 3 submitted documents match applicant Rahul Sharma. Ready for submission.'
                  : 'Discrepancy detected: Electricity bill does not match applicant name. Correct before UIDAI appointment.'}
              </p>
            </div>
          </div>

          {/* Reset / Switch Scenario control button */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer"
              title="Reset to Scenario A"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Document Breakdown List: POI, DOB, POA */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Verified Document Checklist (POI • DOB • POA)
          </h4>
          <span className="text-[11px] text-slate-400">Click any image to enlarge</span>
        </div>

        <div className="space-y-3.5">
          {scenario.documents.map((doc: DemoItemVerification) => {
            const isItemMatch = doc.status === 'MATCHED';

            return (
              <div
                key={doc.category}
                className={`bg-white dark:bg-black p-4 sm:p-5 rounded-2xl border transition-all ${
                  isItemMatch
                    ? 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
                    : 'border-amber-300 dark:border-amber-900/80 bg-amber-50/20 dark:bg-amber-950/10'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {/* Small Image Preview Thumbnail */}
                    <div
                      onClick={() =>
                        onPreviewDocument({
                          title: `${doc.category} — ${doc.docType}`,
                          fileName: doc.fileName,
                          previewUrl: doc.assetPath,
                          mimeType: 'image/jpeg',
                        })
                      }
                      className="group relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 cursor-pointer shadow-xs"
                      title="Click to enlarge sample document"
                    >
                      <img
                        src={doc.assetPath}
                        alt={doc.fileName}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                        <Eye className="w-5 h-5 drop-shadow" />
                      </div>
                    </div>

                    {/* Metadata & Names */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                          {doc.category}
                        </span>
                        <h5 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {doc.docType}
                        </h5>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                        <span>File:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                          {doc.fileName}
                        </span>
                      </div>

                      {/* Name comparison row */}
                      <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400">Name on Document:</span>
                          <span
                            className={`font-semibold ${
                              isItemMatch
                                ? 'text-slate-900 dark:text-white'
                                : 'text-amber-700 dark:text-amber-300 font-bold underline'
                            }`}
                          >
                            {doc.applicantOnDoc}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400">Applicant:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {doc.targetApplicant}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Individual Verification Status & Explanation */}
                  <div className="flex md:flex-col items-start md:items-end justify-between md:justify-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-zinc-800 shrink-0 md:max-w-xs">
                    {/* Status Pill */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        isItemMatch
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                      }`}
                    >
                      {isItemMatch ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{doc.fieldChecked}: Matched</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{doc.fieldChecked}: {doc.statusLabel}</span>
                        </>
                      )}
                    </div>

                    {/* Concise explanation */}
                    <p
                      className={`text-xs md:text-right leading-relaxed ${
                        isItemMatch
                          ? 'text-slate-500 dark:text-slate-400'
                          : 'text-amber-800 dark:text-amber-300 font-medium'
                      }`}
                    >
                      {doc.explanation}
                    </p>

                    {/* Preview button */}
                    <button
                      type="button"
                      onClick={() =>
                        onPreviewDocument({
                          title: `${doc.category} — ${doc.docType}`,
                          fileName: doc.fileName,
                          previewUrl: doc.assetPath,
                          mimeType: 'image/jpeg',
                        })
                      }
                      className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View Full Image</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mandatory UIDAI Disclaimer Banner */}
      <div className="p-4 sm:p-4.5 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div className="space-y-1">
          <p className="font-bold text-amber-950 dark:text-amber-100">
            Document Verification Demo Notice
          </p>
          <p className="leading-relaxed">
            {DEMO_VERIFICATION_DISCLAIMER}
          </p>
        </div>
      </div>

      {/* Bottom Navigation & Workflow Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onSwitchToManualUpload && (
            <button
              type="button"
              onClick={onSwitchToManualUpload}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-900 font-semibold text-xs transition cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Manual Vault Upload</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-800 font-semibold text-xs transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>

        {onContinueToStep3 && (
          <button
            type="button"
            onClick={onContinueToStep3}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow transition cursor-pointer"
          >
            <span>Continue to Step 3: Online or Offline</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
