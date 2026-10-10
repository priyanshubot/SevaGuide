import React, { useState } from 'react';
import {
  X,
  FileText,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Mail,
  Phone,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Tag,
  Info
} from 'lucide-react';
import { FamilyMemberWithDocs, FamilyDocument, FamilyDocumentStatus } from '../types/family';

interface FamilyMemberDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: FamilyMemberWithDocs;
  onAddDocument: (member: FamilyMemberWithDocs) => void;
  onEditDocument: (doc: FamilyDocument, member: FamilyMemberWithDocs) => void;
  onDeleteDocument: (docId: string) => Promise<void>;
  onEditMember: (member: FamilyMemberWithDocs) => void;
  onDeleteMember: (member: FamilyMemberWithDocs) => void;
}

const getStatusBadge = (status: FamilyDocumentStatus) => {
  switch (status) {
    case 'Verified':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300',
        icon: CheckCircle2,
        label: 'Verified'
      };
    case 'Pending Review':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300',
        icon: Clock,
        label: 'Pending Review'
      };
    case 'Needs Attention':
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300',
        icon: AlertTriangle,
        label: 'Needs Attention'
      };
    default:
      return {
        bg: 'bg-slate-100 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-400',
        icon: Info,
        label: 'Not Uploaded'
      };
  }
};

export const FamilyMemberDetailModal: React.FC<FamilyMemberDetailModalProps> = ({
  isOpen,
  onClose,
  member,
  onAddDocument,
  onEditDocument,
  onDeleteDocument,
  onEditMember,
  onDeleteMember
}) => {
  const [docToDelete, setDocToDelete] = useState<FamilyDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleDeleteConfirm = async () => {
    if (!docToDelete) return;
    try {
      setIsDeleting(true);
      await onDeleteDocument(docToDelete.id);
      setDocToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="member-detail-modal-title"
    >
      <div
        className="w-full max-w-3xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-zinc-900 bg-slate-50/70 dark:bg-zinc-950 flex justify-between items-start">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-700 text-white flex items-center justify-center text-lg font-bold shadow-xs shrink-0">
              {member.full_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  id="member-detail-modal-title"
                  className="text-lg font-bold text-slate-900 dark:text-white"
                >
                  {member.full_name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300">
                  {member.relationship}
                </span>
                {member.is_demo && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-slate-300">
                    Demo Record
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                <span className="font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-zinc-900 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-800">
                  {member.management_id}
                </span>
                {member.date_of_birth && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>DOB: {new Date(member.date_of_birth).toLocaleDateString()}</span>
                  </span>
                )}
                {member.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{member.phone}</span>
                  </span>
                )}
                {member.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{member.email}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onEditMember(member)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-zinc-900 transition"
              title="Edit Member Information"
              aria-label="Edit Member"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDeleteMember(member)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
              title="Delete Family Member"
              aria-label="Delete Member"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-900 transition"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Member notes if present */}
        {member.notes && (
          <div className="px-6 py-2.5 bg-slate-50/50 dark:bg-zinc-950/50 border-b border-slate-100 dark:border-zinc-900 text-xs text-slate-600 dark:text-slate-400 italic">
            <strong>Notes:</strong> {member.notes}
          </div>
        )}

        {/* Body - Documents List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                <span>Documents ({member.documents.length})</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Organized records for civic applications, pensions, admissions, and certificates.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onAddDocument(member)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Document</span>
            </button>
          </div>

          {member.documents.length === 0 ? (
            <div className="py-12 border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 dark:bg-zinc-950">
              <FileText className="w-10 h-10 text-slate-300 dark:text-zinc-700 mb-2" />
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">No documents added yet</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm mt-0.5">
                Attach identity, address, or educational records for {member.full_name} to streamline civic applications.
              </p>
              <button
                type="button"
                onClick={() => onAddDocument(member)}
                className="mt-3 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
              >
                Add First Document
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {member.documents.map((doc) => {
                const statusBadge = getStatusBadge(doc.status);
                const StatusIcon = statusBadge.icon;

                return (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-slate-300 dark:hover:border-zinc-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 dark:text-white truncate">
                          {doc.title}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-zinc-700 flex items-center gap-1">
                          <Tag className="w-2.5 h-2.5 text-slate-400" />
                          <span>{doc.category}</span>
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 ${statusBadge.bg}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          <span>{statusBadge.label}</span>
                        </span>
                      </div>

                      {doc.notes && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {doc.notes}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
                        {doc.file_name && (
                          <span className="font-mono text-slate-600 dark:text-slate-300">
                            {doc.file_name}
                          </span>
                        )}
                        {doc.file_size && (
                          <span>{(doc.file_size / 1024).toFixed(1)} KB</span>
                        )}
                        {doc.uploaded_at && (
                          <span>Added {new Date(doc.uploaded_at).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => onEditDocument(doc, member)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-medium transition flex items-center gap-1"
                        aria-label={`Edit ${doc.title}`}
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDocToDelete(doc)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        title="Delete Document"
                        aria-label={`Delete ${doc.title}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-zinc-900 bg-slate-50/70 dark:bg-zinc-950 flex justify-between items-center text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            {member.documents.length} document{member.documents.length === 1 ? '' : 's'} managed for {member.full_name}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-zinc-800 text-white font-semibold text-xs hover:bg-slate-800 dark:hover:bg-zinc-700 transition"
          >
            Done
          </button>
        </div>
      </div>

      {/* Delete Document Confirmation Sub-Modal */}
      {docToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-900">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Delete Document?</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Are you sure you want to delete <strong className="text-slate-800 dark:text-slate-200">{docToDelete.title}</strong>?
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-zinc-800 text-xs">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDocToDelete(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold"
              >
                {isDeleting ? 'Deleting...' : 'Delete Document'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
