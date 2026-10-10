import React, { useState, useEffect } from 'react';
import { X, FileText, Save, AlertCircle, Upload, CheckCircle2 } from 'lucide-react';
import {
  FamilyDocument,
  FamilyDocumentCategory,
  FamilyDocumentStatus
} from '../types/family';

interface FamilyDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (docData: {
    title: string;
    category: FamilyDocumentCategory;
    status: FamilyDocumentStatus;
    file_name?: string;
    file_size?: number;
    notes?: string;
  }) => Promise<void>;
  documentToEdit?: FamilyDocument | null;
  memberName: string;
}

const CATEGORY_OPTIONS: FamilyDocumentCategory[] = [
  'Identity Proof',
  'Address Proof',
  'Birth Certificate',
  'Educational Certificate',
  'Income Certificate',
  'Other Documents'
];

const STATUS_OPTIONS: { value: FamilyDocumentStatus; label: string; desc: string }[] = [
  { value: 'Verified', label: 'Verified', desc: 'Document inspected & matches citizen record' },
  { value: 'Pending Review', label: 'Pending Review', desc: 'Uploaded; awaiting checklist review' },
  { value: 'Needs Attention', label: 'Needs Attention', desc: 'Discrepancy, illegible or renewal needed' },
  { value: 'Not Uploaded', label: 'Not Uploaded', desc: 'Placeholder record awaiting document upload' }
];

export const FamilyDocumentModal: React.FC<FamilyDocumentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  documentToEdit,
  memberName
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<FamilyDocumentCategory>('Identity Proof');
  const [status, setStatus] = useState<FamilyDocumentStatus>('Pending Review');
  const [fileName, setFileName] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (documentToEdit) {
      setTitle(documentToEdit.title);
      setCategory(documentToEdit.category);
      setStatus(documentToEdit.status);
      setFileName(documentToEdit.file_name || '');
      setNotes(documentToEdit.notes || '');
    } else {
      setTitle('');
      setCategory('Identity Proof');
      setStatus('Pending Review');
      setFileName('');
      setNotes('');
    }
    setSelectedFile(null);
    setErrorMsg(null);
  }, [documentToEdit, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);
      if (!title.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim()) {
      setErrorMsg('Document Title is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        title: title.trim(),
        category,
        status,
        file_name: fileName.trim() || undefined,
        file_size: selectedFile ? selectedFile.size : documentToEdit?.file_size,
        notes: notes.trim() || undefined
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save document metadata.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="family-document-modal-title"
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-zinc-900 bg-slate-50/70 dark:bg-zinc-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="family-document-modal-title"
                className="text-base font-bold text-slate-900 dark:text-white"
              >
                {documentToEdit ? 'Edit Document Metadata' : 'Add Document to Member'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Associated Member: <strong className="text-slate-800 dark:text-slate-200">{memberName}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-900 transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label
              htmlFor="doc-title-input"
              className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
            >
              Document Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="doc-title-input"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Municipal Birth Certificate, Class 10 Marksheet"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="doc-category-select"
                className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
              >
                Document Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="doc-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as FamilyDocumentCategory)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="doc-status-select"
                className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
              >
                Verification Status <span className="text-rose-500">*</span>
              </label>
              <select
                id="doc-status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as FamilyDocumentStatus)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Document File Attachment / Placeholder */}
          <div>
            <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
              Document File <span className="text-slate-400 font-normal">(optional attachment or reference)</span>
            </label>
            <div className="border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl p-3.5 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-zinc-950">
              <Upload className="w-5 h-5 text-slate-400 mb-1.5" />
              <label className="cursor-pointer text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                <span>Select file to attach</span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="sr-only"
                  accept=".pdf,.png,.jpg,.jpeg"
                />
              </label>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                PDF, JPG, PNG up to 10MB
              </span>
              {fileName && (
                <div className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[280px]">{fileName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Notes / Remarks */}
          <div>
            <label
              htmlFor="doc-notes-input"
              className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
            >
              Notes or Review Remarks <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="doc-notes-input"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Name matches father's pension records. Clear municipal seal verified."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none transition"
            />
          </div>

          <div className="p-2.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-[11px] text-blue-800 dark:text-blue-300">
            <strong>Notice:</strong> Document statuses reflect household preparedness checks within SevaGuide and do not imply official government agency endorsement.
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 flex justify-end gap-2.5 border-t border-slate-100 dark:border-zinc-900">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold flex items-center gap-1.5 shadow-xs transition"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : documentToEdit ? 'Save Changes' : 'Add Document'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
