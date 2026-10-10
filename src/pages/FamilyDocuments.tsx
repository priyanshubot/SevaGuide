import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  RotateCcw,
  Info,
  Check,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  FamilyMember,
  FamilyDocument,
  FamilyMemberWithDocs,
  FamilyDocumentCategory,
  FamilyDocumentStatus,
  CompletionStatus
} from '../types/family';
import {
  FamilyDocumentsService,
  calculateFamilyStats,
  generateNextManagementId
} from '../services/familyDocumentsService';
import { FamilyMemberModal } from '../components/FamilyMemberModal';
import { FamilyDocumentModal } from '../components/FamilyDocumentModal';
import { FamilyMemberDetailModal } from '../components/FamilyMemberDetailModal';

export const FamilyDocuments: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || 'demo_citizen_user';

  const [members, setMembers] = useState<FamilyMemberWithDocs[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | CompletionStatus>('All');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modals state
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<FamilyMember | null>(null);

  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docToEdit, setDocToEdit] = useState<FamilyDocument | null>(null);
  const [docMemberTarget, setDocMemberTarget] = useState<FamilyMemberWithDocs | null>(null);

  const [detailModalMember, setDetailModalMember] = useState<FamilyMemberWithDocs | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<FamilyMemberWithDocs | null>(null);
  const [isDeletingMember, setIsDeletingMember] = useState(false);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load data
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await FamilyDocumentsService.loadFamilyData(userId);
      setMembers(data);
    } catch (err: any) {
      showToast('Failed to load family documents.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  // Keep detail modal updated when members change
  useEffect(() => {
    if (detailModalMember) {
      const found = members.find((m) => m.id === detailModalMember.id);
      if (found) {
        setDetailModalMember(found);
      }
    }
  }, [members]);

  // Summary statistics
  const stats = useMemo(() => calculateFamilyStats(members), [members]);

  // Next suggested management ID
  const suggestedManagementId = useMemo(
    () => generateNextManagementId(members),
    [members]
  );

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      // Search
      const search = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !search ||
        member.full_name.toLowerCase().includes(search) ||
        member.relationship.toLowerCase().includes(search) ||
        member.management_id.toLowerCase().includes(search) ||
        member.documents.some((d) => d.title.toLowerCase().includes(search));

      // Status filter
      const matchesStatus =
        statusFilter === 'All' || member.completion_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [members, searchTerm, statusFilter]);

  // ---------------- Member Handlers ----------------
  const handleOpenAddMember = () => {
    setMemberToEdit(null);
    setIsMemberModalOpen(true);
  };

  const handleOpenEditMember = (member: FamilyMemberWithDocs) => {
    setMemberToEdit(member);
    setIsMemberModalOpen(true);
  };

  const handleSaveMember = async (data: {
    full_name: string;
    relationship: string;
    date_of_birth?: string;
    email?: string;
    phone?: string;
    notes?: string;
  }) => {
    if (memberToEdit) {
      await FamilyDocumentsService.updateMember(userId, memberToEdit.id, data);
      showToast(`Updated details for ${data.full_name}.`);
    } else {
      const created = await FamilyDocumentsService.addMember(userId, data, members);
      showToast(`Added ${created.full_name} (${created.management_id}) to family records.`);
    }
    await loadData();
  };

  const handleDeleteMemberConfirm = async () => {
    if (!memberToDelete) return;
    try {
      setIsDeletingMember(true);
      await FamilyDocumentsService.deleteMember(userId, memberToDelete.id);
      if (detailModalMember?.id === memberToDelete.id) {
        setDetailModalMember(null);
      }
      showToast(`Removed ${memberToDelete.full_name} and associated records.`);
      setMemberToDelete(null);
      await loadData();
    } finally {
      setIsDeletingMember(false);
    }
  };

  // ---------------- Document Handlers ----------------
  const handleOpenAddDocument = (member: FamilyMemberWithDocs) => {
    setDocMemberTarget(member);
    setDocToEdit(null);
    setIsDocModalOpen(true);
  };

  const handleOpenEditDocument = (doc: FamilyDocument, member: FamilyMemberWithDocs) => {
    setDocMemberTarget(member);
    setDocToEdit(doc);
    setIsDocModalOpen(true);
  };

  const handleSaveDocument = async (docData: {
    title: string;
    category: FamilyDocumentCategory;
    status: FamilyDocumentStatus;
    file_name?: string;
    file_size?: number;
    notes?: string;
  }) => {
    if (!docMemberTarget) return;

    if (docToEdit) {
      await FamilyDocumentsService.updateDocument(userId, docToEdit.id, docData);
      showToast(`Updated document "${docData.title}".`);
    } else {
      await FamilyDocumentsService.addDocument(userId, {
        ...docData,
        family_member_id: docMemberTarget.id
      });
      showToast(`Added "${docData.title}" for ${docMemberTarget.full_name}.`);
    }
    await loadData();
  };

  const handleDeleteDocument = async (docId: string) => {
    await FamilyDocumentsService.deleteDocument(userId, docId);
    showToast('Document deleted.');
    await loadData();
  };

  // Reset to demo data
  const handleResetDemoData = () => {
    if (window.confirm('Reset all family members and documents to the 4 initial demonstration records?')) {
      const reset = FamilyDocumentsService.resetToDemo(userId);
      setMembers(reset);
      setDetailModalMember(null);
      showToast('Reset to initial demonstration records.');
    }
  };

  const getCompletionBadge = (status: CompletionStatus) => {
    switch (status) {
      case 'Complete':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300',
          label: 'Complete'
        };
      case 'Needs Attention':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300',
          label: 'Needs Attention'
        };
      case 'In Progress':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300',
          label: 'In Progress'
        };
      default:
        return {
          bg: 'bg-slate-100 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-400',
          label: 'No Documents'
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-zinc-900 dark:bg-black text-emerald-400 border border-emerald-500/40'
              : 'bg-zinc-900 dark:bg-black text-rose-400 border border-rose-500/40'
          }`}
          role="status"
        >
          {toastMessage.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-blue-700 text-white shadow-xs">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Family Document Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Organize and manage your family's documents in one place.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            type="button"
            onClick={handleResetDemoData}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 text-xs font-medium transition flex items-center gap-1.5"
            title="Reset demonstration records"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAddMember}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Family Member</span>
          </button>
        </div>
      </div>

      {/* Important Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 flex items-start gap-3 text-xs text-blue-900 dark:text-blue-200">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold">Household Records & Privacy Notice:</span>
          <p className="text-blue-800/90 dark:text-blue-300/90 text-[11px] leading-relaxed">
            Family Management IDs (e.g., <code className="font-mono font-semibold">FAM-2026-001</code>) are internal household identifiers created exclusively for organizing civic records within your SevaGuide profile. They are not government identity numbers. Verification statuses reflect organizational checks to assist in public scheme applications.
          </p>
        </div>
      </div>

      {/* 4 DYNAMIC SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Family Members */}
        <div className="p-5 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Family Members</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {stats.totalMembers}
            </div>
            <span className="text-[11px] text-slate-400">Indexed in household</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* 2. Total Documents */}
        <div className="p-5 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Documents</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {stats.totalDocuments}
            </div>
            <span className="text-[11px] text-slate-400">Across all categories</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        {/* 3. Verified Documents */}
        <div className="p-5 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Verified Documents</span>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {stats.verifiedDocuments}
            </div>
            <span className="text-[11px] text-slate-400">Ready for applications</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* 4. Documents Requiring Attention */}
        <div className="p-5 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Requiring Attention</span>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
              {stats.attentionDocuments}
            </div>
            <span className="text-[11px] text-slate-400">Needs update / action</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, relationship, ID (e.g., FAM-2026-001)..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['All', 'Complete', 'In Progress', 'Needs Attention', 'Empty'] as const).map((filter) => {
            const isSelected = statusFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* FAMILY MEMBERS LIST / GRID */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500 dark:text-slate-400">
          Loading family documents and members...
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="py-16 border border-dashed border-slate-200 dark:border-zinc-800 rounded-3xl text-center p-8 bg-white dark:bg-black">
          <Users className="w-12 h-12 text-slate-300 dark:text-zinc-700 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No family records match your filters</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or add a new family member to your profile.
          </p>
          <button
            type="button"
            onClick={handleOpenAddMember}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
          >
            Add Family Member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredMembers.map((member) => {
            const completion = getCompletionBadge(member.completion_status);

            return (
              <div
                key={member.id}
                className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition flex flex-col justify-between gap-4"
              >
                {/* Member Header */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-blue-700 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                        {member.full_name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                            {member.full_name}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                            {member.relationship}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-zinc-900 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-800">
                            {member.management_id}
                          </span>
                          {member.is_demo && (
                            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded">
                              Demo
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border shrink-0 ${completion.bg}`}
                    >
                      {completion.label}
                    </span>
                  </div>

                  {/* Document Breakdown */}
                  <div className="pt-2 border-t border-slate-100 dark:border-zinc-900 text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Documents ({member.documents.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenAddDocument(member)}
                        className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Doc</span>
                      </button>
                    </div>

                    {member.documents.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic">
                        No documents attached. Click "Add Doc" to index certificates.
                      </p>
                    ) : (
                      <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                        {member.documents.slice(0, 3).map((doc) => (
                          <div
                            key={doc.id}
                            className="p-1.5 rounded-lg bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px]"
                          >
                            <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                              {doc.title}
                            </span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                                doc.status === 'Verified'
                                  ? 'text-emerald-700 dark:text-emerald-400'
                                  : doc.status === 'Needs Attention'
                                  ? 'text-rose-700 dark:text-rose-400'
                                  : 'text-amber-700 dark:text-amber-400'
                              }`}
                            >
                              {doc.status}
                            </span>
                          </div>
                        ))}
                        {member.documents.length > 3 && (
                          <p className="text-[10px] text-slate-400 text-right">
                            +{member.documents.length - 3} more document(s)
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-zinc-900 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setDetailModalMember(member)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold transition flex items-center gap-1.5"
                  >
                    <span>View Documents</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditMember(member)}
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 transition"
                      title="Edit Family Member"
                      aria-label={`Edit ${member.full_name}`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setMemberToDelete(member)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      title="Delete Family Member"
                      aria-label={`Delete ${member.full_name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ---------------- MODALS ---------------- */}

      {/* 1. Add / Edit Member Modal */}
      <FamilyMemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        onSave={handleSaveMember}
        memberToEdit={memberToEdit}
        suggestedManagementId={suggestedManagementId}
      />

      {/* 2. Add / Edit Document Modal */}
      <FamilyDocumentModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        onSave={handleSaveDocument}
        documentToEdit={docToEdit}
        memberName={docMemberTarget ? docMemberTarget.full_name : ''}
      />

      {/* 3. Detail Modal */}
      {detailModalMember && (
        <FamilyMemberDetailModal
          isOpen={Boolean(detailModalMember)}
          onClose={() => setDetailModalMember(null)}
          member={detailModalMember}
          onAddDocument={(m) => handleOpenAddDocument(m)}
          onEditDocument={(doc, m) => handleOpenEditDocument(doc, m)}
          onDeleteDocument={handleDeleteDocument}
          onEditMember={(m) => handleOpenEditMember(m)}
          onDeleteMember={(m) => setMemberToDelete(m)}
        />
      )}

      {/* 4. Delete Member Confirmation Modal */}
      {memberToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-900">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Delete Family Member?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Are you sure you want to remove <strong className="text-slate-800 dark:text-slate-200">{memberToDelete.full_name}</strong> ({memberToDelete.management_id})?
                  This will also remove all {memberToDelete.documents.length} associated document records.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-zinc-800 text-xs">
              <button
                type="button"
                disabled={isDeletingMember}
                onClick={() => setMemberToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingMember}
                onClick={handleDeleteMemberConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold"
              >
                {isDeletingMember ? 'Deleting...' : 'Delete Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
