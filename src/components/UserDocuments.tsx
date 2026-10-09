import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { UserDocument } from '../types';
import { DocumentUploader } from './DocumentUploader';
import {
  FileText,
  Plus,
  Trash2,
  ExternalLink,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Loader2,
  FolderOpen,
  Filter,
  Search,
  AlertCircle,
  Cpu,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const UserDocuments: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<UserDocument | null>(null);
  const [expandedOcrDocId, setExpandedOcrDocId] = useState<string | null>(null);

  // Search & filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const fetchDocuments = async () => {
    if (!user) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.warn('Error fetching documents:', error.message);
        setErrorMsg(error.message);
      } else if (data) {
        setDocuments(data as UserDocument[]);
      }
    } catch (err: any) {
      console.warn('Documents fetch exception:', err);
      setErrorMsg(err.message || 'Failed to load documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  // View private file using authenticated signed URL (3600s validity)
  const handleView = async (doc: UserDocument) => {
    setActionLoadingId(`view-${doc.id}`);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(doc.storage_path, 3600);

      if (error) {
        throw new Error(error.message || 'Unable to generate document preview link.');
      }

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not open document.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Direct authenticated download from private storage bucket
  const handleDownload = async (doc: UserDocument) => {
    setActionLoadingId(`download-${doc.id}`);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(doc.storage_path);

      if (error) {
        throw new Error(error.message || 'Failed to download document file.');
      }

      if (data) {
        const url = URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.file_name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not download document.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Confirm and execute deletion from both storage and database
  const confirmDelete = async () => {
    if (!deleteCandidate) return;

    setActionLoadingId(`del-${deleteCandidate.id}`);
    setErrorMsg(null);
    try {
      // 1. Remove from private Supabase storage
      const { error: storageErr } = await supabase.storage
        .from('documents')
        .remove([deleteCandidate.storage_path]);

      if (storageErr) {
        console.warn('Storage deletion warning:', storageErr.message);
      }

      // 2. Remove from database metadata table
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', deleteCandidate.id);

      if (dbError) {
        throw new Error(dbError.message);
      }

      setDocuments((prev) => prev.filter((d) => d.id !== deleteCandidate.id));
      setDeleteCandidate(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete document.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return null;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderStatusBadge = (status: UserDocument['verification_status']) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Verified
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Needs Review
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            Issue Found
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            <Clock className="w-3 h-3 text-slate-500" />
            Pending Check
          </span>
        );
    }
  };

  // Filtered documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.document_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.file_name.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedFilter === 'All') return matchesSearch;
    if (selectedFilter === 'Identity') {
      return (
        matchesSearch &&
        (doc.document_type.includes('Aadhaar') ||
          doc.document_type.includes('PAN') ||
          doc.document_type.includes('Passport') ||
          doc.document_type.includes('Voter') ||
          doc.document_type.includes('Licence') ||
          doc.document_type.includes('Identity'))
      );
    }
    if (selectedFilter === 'Certificates') {
      return (
        matchesSearch &&
        (doc.document_type.includes('Certificate') ||
          doc.document_type.includes('Income') ||
          doc.document_type.includes('Domicile'))
      );
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Your Documents</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
              {documents.length} {documents.length === 1 ? 'file' : 'files'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Encrypted personal vault for citizen documents and government submissions
          </p>
        </div>

        <button
          onClick={() => setShowUploader(!showUploader)}
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <Plus className="w-4 h-4" />
          <span>{showUploader ? 'Close Upload' : '+ Upload Document'}</span>
        </button>
      </div>

      {errorMsg && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
            errorMsg.includes('schema cache') || errorMsg.includes('PGRST205')
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <AlertCircle
            className={`w-5 h-5 shrink-0 mt-0.5 ${
              errorMsg.includes('schema cache') || errorMsg.includes('PGRST205')
                ? 'text-amber-600'
                : 'text-rose-600'
            }`}
          />
          <div className="space-y-1.5 flex-1">
            {errorMsg.includes('schema cache') || errorMsg.includes('PGRST205') ? (
              <>
                <div className="font-bold text-amber-950 text-sm">
                  Database Table Not Initialized: &apos;public.documents&apos;
                </div>
                <p className="leading-relaxed text-amber-900">
                  Supabase could not find table <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-semibold text-amber-950">public.documents</code> in the schema cache.
                  To resolve this, open your <strong>Supabase Dashboard &gt; SQL Editor</strong> and run the migration script provided in <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-semibold text-amber-950">supabase/schema.sql</code>.
                </p>
                <div className="text-[11px] font-mono text-amber-800/80 pt-1 border-t border-amber-200/60">
                  PostgREST Error: {errorMsg}
                </div>
              </>
            ) : (
              <p>{errorMsg}</p>
            )}
          </div>
        </div>
      )}

      {/* Upload Drawer / Modal */}
      {showUploader && (
        <DocumentUploader
          onUploadSuccess={(newDoc) => {
            setDocuments((prev) => [newDoc, ...prev]);
            setShowUploader(false);
          }}
        />
      )}

      {/* Filter & Search Bar (only when documents exist) */}
      {documents.length > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 dark:bg-zinc-950 p-3 rounded-xl border border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
            <div className="flex gap-1.5">
              {['All', 'Identity', 'Certificates'].map((filterName) => (
                <button
                  key={filterName}
                  onClick={() => setSelectedFilter(filterName)}
                  className={`text-xs px-3 py-1 rounded-lg font-medium transition ${
                    selectedFilter === filterName
                      ? 'bg-blue-700 text-white shadow-sm'
                      : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {filterName}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 w-full sm:w-48"
            />
          </div>
        </div>
      )}

      {/* Documents Grid / Empty State */}
      {loading ? (
        <div className="py-12 flex flex-col justify-center items-center gap-2 text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin text-blue-700" />
          <span className="text-xs">Loading secure document vault...</span>
        </div>
      ) : documents.length === 0 ? (
        <div className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 sm:p-12 text-center space-y-4">
          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 w-14 h-14 rounded-2xl mx-auto flex items-center justify-center border border-blue-100 dark:border-blue-900">
            <FolderOpen className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">No documents in your vault yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Upload your Aadhaar Card, PAN Card, Driving Licence, Voter ID, or Income Certificate. Stored documents are privately encrypted and ready for fast pre-submission checks.
            </p>
          </div>
          <button
            onClick={() => setShowUploader(true)}
            className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Your First Document</span>
          </button>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-500">
          No documents matching "{searchTerm}" under {selectedFilter}.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-slate-300 dark:hover:border-zinc-700 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-xl shrink-0 mt-0.5">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{doc.document_type}</h4>
                        {doc.ocr_data && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                            <Cpu className="w-2.5 h-2.5" />
                            <span>OCR Verified</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-[240px] mt-0.5">
                        {doc.file_name}
                      </p>
                    </div>
                  </div>
                  <div>{renderStatusBadge(doc.verification_status)}</div>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500 mt-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
                  <span>Uploaded {formatDate(doc.uploaded_at)}</span>
                  {doc.file_size && <span>• {formatFileSize(doc.file_size)}</span>}
                </div>

                {doc.ocr_data && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-zinc-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setExpandedOcrDocId(expandedOcrDocId === doc.id ? null : doc.id)}
                      className="flex items-center justify-between w-full text-slate-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 font-semibold text-[11px] py-1 cursor-pointer transition"
                    >
                      <span className="flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Extracted OCR Details</span>
                      </span>
                      {expandedOcrDocId === doc.id ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {expandedOcrDocId === doc.id && (
                      <div className="mt-2 p-3 bg-slate-50 dark:bg-zinc-950 rounded-xl space-y-1.5 text-[11px] font-mono border border-slate-200 dark:border-zinc-800">
                        {doc.ocr_data.candidatePanNumber && (
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-sans">PAN Number:</span>
                            <span className="font-bold text-slate-900 dark:text-white">{doc.ocr_data.candidatePanNumber}</span>
                          </div>
                        )}
                        {doc.ocr_data.candidateName && (
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-sans">Cardholder:</span>
                            <span className="font-semibold text-slate-900 dark:text-white uppercase">{doc.ocr_data.candidateName}</span>
                          </div>
                        )}
                        {doc.ocr_data.candidateFatherName && (
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-sans">Father's Name:</span>
                            <span className="text-slate-800 dark:text-slate-200 uppercase">{doc.ocr_data.candidateFatherName}</span>
                          </div>
                        )}
                        {doc.ocr_data.candidateDob && (
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-sans">Date of Birth:</span>
                            <span className="text-slate-800 dark:text-slate-200">{doc.ocr_data.candidateDob}</span>
                          </div>
                        )}
                        {doc.ocr_data.ocrConfidence !== undefined && (
                          <div className="flex justify-between items-center pt-1 border-t border-slate-200/60 dark:border-zinc-800/60">
                            <span className="text-slate-500 font-sans">OCR Confidence:</span>
                            <span className="text-blue-600 dark:text-blue-400 font-semibold">{doc.ocr_data.ocrConfidence}%</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons: View, Download, Delete */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleView(doc)}
                    disabled={actionLoadingId === `view-${doc.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-blue-50/50 dark:hover:bg-zinc-800 hover:border-blue-200 dark:hover:border-zinc-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    title="View preview via signed URL"
                  >
                    {actionLoadingId === `view-${doc.id}` ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    )}
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => handleDownload(doc)}
                    disabled={actionLoadingId === `download-${doc.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-blue-50/50 dark:hover:bg-zinc-800 hover:border-blue-200 dark:hover:border-zinc-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    title="Download file securely"
                  >
                    {actionLoadingId === `download-${doc.id}` ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    )}
                    <span>Download</span>
                  </button>
                </div>

                <button
                  onClick={() => setDeleteCandidate(doc)}
                  disabled={actionLoadingId === `del-${doc.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
                  title="Delete document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deletion Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xl max-w-sm w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-xl shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Delete Document?</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Are you sure you want to delete <strong className="text-slate-800 dark:text-slate-200">{deleteCandidate.document_type}</strong> ({deleteCandidate.file_name})? This file will be permanently removed from private storage.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-zinc-800">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={Boolean(actionLoadingId)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition flex items-center gap-1.5"
              >
                {actionLoadingId ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
