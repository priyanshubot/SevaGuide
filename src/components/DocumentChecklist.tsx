import React from 'react';
import { DocumentRequirement } from '../types';
import {
  Check,
  CheckCircle2,
  Clock,
  RotateCcw,
  CheckCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface DocumentChecklistProps {
  documents: DocumentRequirement[];
  checkedMap: Record<string, boolean>;
  onToggle: (docId: string) => void;
  onSelectAll: () => void;
  onReset: () => void;
}

export const DocumentChecklist: React.FC<DocumentChecklistProps> = ({
  documents,
  checkedMap,
  onToggle,
  onSelectAll,
  onReset,
}) => {
  const readyDocs = documents.filter((doc) => Boolean(checkedMap[doc.id]));
  const stillNeededDocs = documents.filter((doc) => !checkedMap[doc.id]);

  const allReady = stillNeededDocs.length === 0;
  const noneReady = readyDocs.length === 0;

  return (
    <div className="space-y-6">
      {/* Quick utility actions */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="font-medium">
          Click any row to toggle document readiness
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSelectAll}
            disabled={allReady}
            className="inline-flex items-center gap-1.5 font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-40 disabled:hover:text-blue-700 transition cursor-pointer"
            aria-label="Mark all documents as ready"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All Ready</span>
          </button>
          <span className="text-slate-300 dark:text-zinc-700">|</span>
          <button
            type="button"
            onClick={onReset}
            disabled={noneReady}
            className="inline-flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 transition cursor-pointer"
            aria-label="Reset checklist selections"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: STILL NEEDED */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-900/60">
              <Clock className="w-3.5 h-3.5" />
            </span>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Still Needed
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300">
              {stillNeededDocs.length}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            Pending availability
          </span>
        </div>

        {stillNeededDocs.length === 0 ? (
          <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                All documents marked as ready!
              </p>
              <p className="text-emerald-700 dark:text-emerald-400 mt-0.5">
                You have confirmed all documents for this service. You are ready to continue.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {stillNeededDocs.map((doc) => (
              <ChecklistRow
                key={doc.id}
                doc={doc}
                isChecked={false}
                onToggle={() => onToggle(doc.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: READY */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-900/60">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Ready
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              {readyDocs.length}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            Confirmed on hand
          </span>
        </div>

        {readyDocs.length === 0 ? (
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-dashed border-slate-200 dark:border-zinc-800 text-center text-xs text-slate-500 dark:text-slate-400">
            <p className="font-medium">No documents marked ready yet.</p>
            <p className="mt-1 text-[11px]">
              Tap or click any document above as you locate your physical papers or digital files.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {readyDocs.map((doc) => (
              <ChecklistRow
                key={doc.id}
                doc={doc}
                isChecked={true}
                onToggle={() => onToggle(doc.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface ChecklistRowProps {
  doc: DocumentRequirement;
  isChecked: boolean;
  onToggle: () => void;
}

const ChecklistRow: React.FC<ChecklistRowProps> = ({ doc, isChecked, onToggle }) => {
  return (
    <div
      role="checkbox"
      aria-checked={isChecked}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onToggle();
        }
      }}
      className={`group relative w-full rounded-2xl border p-4 sm:p-5 flex items-start justify-between gap-3.5 sm:gap-4 transition-all duration-150 cursor-pointer select-none text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black ${
        isChecked
          ? 'bg-white dark:bg-black border-emerald-200 dark:border-emerald-900/70 hover:border-emerald-300 dark:hover:border-emerald-800 shadow-xs'
          : 'bg-white dark:bg-black border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-xs'
      }`}
    >
      {/* Left Checkbox Icon & Document Details */}
      <div className="flex items-start gap-3.5 sm:gap-4 flex-1 min-w-0">
        {/* Checkbox box */}
        <div
          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-150 ${
            isChecked
              ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-xs'
              : 'border-2 border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 group-hover:border-blue-500 dark:group-hover:border-blue-400'
          }`}
          aria-hidden="true"
        >
          {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
        </div>

        {/* Text information */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              className={`font-semibold text-sm sm:text-base leading-snug transition-colors ${
                isChecked
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-800 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400'
              }`}
            >
              {doc.name}
            </h4>

            {/* Required vs Conditional vs Optional tag */}
            {doc.isConditional ? (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                <AlertCircle className="w-2.5 h-2.5" />
                <span>Conditional</span>
              </span>
            ) : doc.required ? (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                Required
              </span>
            ) : (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-zinc-700">
                Optional
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {doc.description}
          </p>

          {/* Conditional Note if present */}
          {doc.conditionNote && (
            <div className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-900/50 rounded-lg px-2.5 py-1.5 flex items-start gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <span>{doc.conditionNote}</span>
            </div>
          )}

          {/* Accepted Examples */}
          {doc.acceptedExamples && doc.acceptedExamples.length > 0 && (
            <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Accepted examples: </span>
              <span>{doc.acceptedExamples.join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Status Pill */}
      <div className="shrink-0 flex items-center mt-0.5">
        {isChecked ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Ready</span>
          </span>
        ) : doc.required ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            <Clock className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>Still Needed</span>
          </span>
        ) : doc.isConditional ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <span>If Applicable</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-zinc-700">
            <span>Optional</span>
          </span>
        )}
      </div>
    </div>
  );
};
