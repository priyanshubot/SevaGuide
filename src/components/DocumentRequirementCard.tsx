import React, { useState } from 'react';
import { DocumentRequirement } from '../types';
import {
  FileCheck,
  Upload,
  Check,
  X,
  AlertCircle,
  FileText,
  Eye,
  RefreshCw,
  Loader2,
  Trash2,
  Cpu,
  ArrowUpCircle,
  ShieldCheck,
} from 'lucide-react';
import { validateOcrFile } from '../services/ocr';

export type DocumentItemStatus =
  | 'idle'
  | 'selected'
  | 'uploading'
  | 'uploaded'
  | 'processing'
  | 'ready_for_review'
  | 'failed';

export interface DocumentItemState {
  docId: string;
  file: File | null;
  previewUrl: string | null;
  status: DocumentItemStatus;
  statusMessage?: string;
  errorMessage?: string | null;
  storagePath?: string | null;
  persistedDbId?: string | null;
  signedUrl?: string | null;
  ocrConfidence?: number | null;
}

export interface DocumentRequirementCardProps {
  doc: DocumentRequirement;
  itemState?: DocumentItemState;
  // Legacy / simple props for backwards-compatibility:
  uploadedFile?: File | null;
  onUpload?: (file: File) => void;
  onRemove?: () => void;
  // Enhanced interactive handlers:
  onSelectFile?: (file: File) => void;
  onUploadFile?: () => Promise<void>;
  onRemoveFile?: () => void;
  onDeleteUploadedFile?: () => void;
  onPreviewFile?: () => void;
  accept?: string;
  errorMessage?: string | null;
  isOcrTarget?: boolean;
  disabled?: boolean;
}

export const DocumentRequirementCard: React.FC<DocumentRequirementCardProps> = ({
  doc,
  itemState,
  uploadedFile,
  onUpload,
  onRemove,
  onSelectFile,
  onUploadFile,
  onRemoveFile,
  onDeleteUploadedFile,
  onPreviewFile,
  accept = 'image/jpeg,image/png',
  errorMessage,
  isOcrTarget = false,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Unify props: support both new `itemState` and legacy `uploadedFile`
  const activeFile = itemState?.file || uploadedFile || null;
  const activeStatus: DocumentItemStatus =
    itemState?.status || (uploadedFile ? 'selected' : 'idle');
  const activePreviewUrl = itemState?.previewUrl || null;
  const activeError = errorMessage || itemState?.errorMessage || localError;

  const handleFilePicked = (file: File) => {
    setLocalError(null);
    if (isOcrTarget) {
      const validation = validateOcrFile(file);
      if (!validation.valid) {
        setLocalError(validation.error || 'Invalid file format.');
        return;
      }
    }
    if (onSelectFile) {
      onSelectFile(file);
    } else if (onUpload) {
      onUpload(file);
    }
  };

  const handleClear = () => {
    setLocalError(null);
    if (onRemoveFile) {
      onRemoveFile();
    } else if (onRemove) {
      onRemove();
    }
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isImageFile =
    Boolean(activeFile) &&
    (activeFile?.type.startsWith('image/') || /\.(jpe?g|png)$/i.test(activeFile?.name || ''));

  // Render the distinct status badge
  const renderStatusBadge = () => {
    switch (activeStatus) {
      case 'uploading':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Uploading...</span>
          </span>
        );
      case 'uploaded':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Uploaded to Vault</span>
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Cpu className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
            <span>Processing OCR...</span>
          </span>
        );
      case 'ready_for_review':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Ready for Review</span>
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>Failed</span>
          </span>
        );
      case 'selected':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-zinc-700">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            <span>Selected (Not Uploaded)</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4 transition-colors">
      {/* Header with requirement title, category & required badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-100 dark:bg-zinc-900 rounded-xl text-slate-700 dark:text-slate-300 shrink-0">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-slate-900 dark:text-white text-base">{doc.name}</h4>
              {isOcrTarget && (
                <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                  OCR Enabled
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{doc.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {renderStatusBadge()}
          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
              doc.required
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {doc.required ? 'Required' : 'Optional'}
          </span>
        </div>
      </div>

      {/* Error alert if any */}
      {activeError && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
          <div className="flex-1">
            <p className="font-semibold">Upload notice:</p>
            <p className="mt-0.5">{activeError}</p>
          </div>
        </div>
      )}

      {/* Upload area or selected file manager card */}
      {!activeFile ? (
        // Dropzone / File Picker
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setIsDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragOver(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            if (disabled) return;
            const file = e.dataTransfer.files?.[0];
            if (file) handleFilePicked(file);
          }}
          className={`border-2 border-dashed rounded-xl p-5 text-center transition ${
            isDragOver
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
              : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 hover:border-slate-300 dark:hover:border-zinc-700'
          } ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
        >
          <label className="cursor-pointer flex flex-col items-center justify-center gap-1.5 py-1">
            <div className="p-2.5 rounded-full bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-slate-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-blue-700 dark:text-blue-400 font-bold hover:underline">
                Choose file
              </span>{' '}
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                or drag & drop here
              </span>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Supported: JPG, PNG (Max 10 MB)
            </span>
            <input
              type="file"
              accept={accept}
              disabled={disabled}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFilePicked(file);
                e.target.value = '';
              }}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        // Active file card with thumbnail preview and controls
        <div
          className={`rounded-xl border p-4 transition-all ${
            activeStatus === 'uploaded' || activeStatus === 'ready_for_review'
              ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20'
              : activeStatus === 'failed'
              ? 'border-rose-300 dark:border-rose-800/80 bg-rose-50/30 dark:bg-rose-950/20'
              : activeStatus === 'uploading'
              ? 'border-blue-300 dark:border-blue-800/80 bg-blue-50/30 dark:bg-blue-950/20'
              : 'border-slate-200 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-900/60'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* File info with thumbnail preview */}
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              {/* Image thumbnail or file icon */}
              {isImageFile && (activePreviewUrl || itemState?.signedUrl) ? (
                <button
                  type="button"
                  onClick={onPreviewFile}
                  title="Click to zoom preview"
                  className="relative group w-14 h-14 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700 shrink-0 bg-white dark:bg-black cursor-pointer shadow-xs"
                >
                  <img
                    src={activePreviewUrl || itemState?.signedUrl || ''}
                    alt={activeFile.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-white">
                    <Eye className="w-4 h-4" />
                  </div>
                </button>
              ) : (
                <div className="w-14 h-14 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-900 flex items-center justify-center text-slate-500 shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
              )}

              {/* Name, size, type */}
              <div className="min-w-0 flex-1">
                <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {activeFile.name}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex-wrap">
                  <span className="font-mono">{formatFileSize(activeFile.size)}</span>
                  <span>•</span>
                  <span>{activeFile.type || 'image/jpeg'}</span>
                </div>

                {/* Subtext explaining status */}
                <p className="text-[11px] mt-1 font-medium">
                  {activeStatus === 'selected' && (
                    <span className="text-slate-500 dark:text-slate-400">
                      File chosen on your device. Click "Upload to Vault" or run verification below.
                    </span>
                  )}
                  {activeStatus === 'uploading' && (
                    <span className="text-blue-600 dark:text-blue-400">
                      Uploading securely to private Supabase storage...
                    </span>
                  )}
                  {activeStatus === 'uploaded' && (
                    <span className="text-emerald-700 dark:text-emerald-400">
                      Saved in your encrypted document vault.
                    </span>
                  )}
                  {activeStatus === 'processing' && (
                    <span className="text-amber-700 dark:text-amber-400">
                      Analyzing document text via browser Web Worker...
                    </span>
                  )}
                  {activeStatus === 'ready_for_review' && (
                    <span className="text-emerald-700 dark:text-emerald-400">
                      OCR scan complete. Results ready below.
                    </span>
                  )}
                  {activeStatus === 'failed' && (
                    <span className="text-rose-600 dark:text-rose-400">
                      Action failed. Click retry to attempt upload again.
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Actions for this document card */}
            <div className="flex items-center gap-2 flex-wrap self-end sm:self-center shrink-0">
              {/* Preview Button */}
              {onPreviewFile && (activePreviewUrl || itemState?.signedUrl) && (
                <button
                  type="button"
                  onClick={onPreviewFile}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
                  title="Preview document"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              )}

              {/* Upload Now Button (shown when file is selected locally but not uploaded yet) */}
              {activeStatus === 'selected' && onUploadFile && (
                <button
                  type="button"
                  onClick={() => onUploadFile()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
                >
                  <ArrowUpCircle className="w-3.5 h-3.5" />
                  <span>Upload to Vault</span>
                </button>
              )}

              {/* Retry Button (shown on failure) */}
              {activeStatus === 'failed' && onUploadFile && (
                <button
                  type="button"
                  onClick={() => onUploadFile()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Upload</span>
                </button>
              )}

              {/* Replace Button */}
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Replace</span>
                <input
                  type="file"
                  accept={accept}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFilePicked(f);
                    e.target.value = '';
                  }}
                  className="hidden"
                />
              </label>

              {/* Delete / Remove Button */}
              {activeStatus === 'uploaded' && onDeleteUploadedFile ? (
                <button
                  type="button"
                  onClick={onDeleteUploadedFile}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  title="Delete from vault"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-zinc-800 transition"
                  title="Remove local selection"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};