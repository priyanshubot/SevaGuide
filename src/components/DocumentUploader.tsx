import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { DocumentCategoryType, UserDocument } from '../types';
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Eye,
  RefreshCw,
  X,
} from 'lucide-react';
import { FilePreviewModal } from './FilePreviewModal';

export const DOCUMENT_TYPE_OPTIONS: DocumentCategoryType[] = [
  'Aadhaar Card',
  'PAN Card',
  'Driving Licence',
  'Voter ID',
  'Income Certificate',
  'Domicile Certificate',
  'Passport',
  'Proof of Address',
  'Proof of Identity',
  'Proof of Date of Birth',
  'Photograph',
  'Other',
];

interface DocumentUploaderProps {
  onUploadSuccess?: (doc: UserDocument) => void;
  defaultType?: DocumentCategoryType;
  initialVerificationStatus?: 'pending' | 'verified' | 'warning' | 'error';
  buttonLabel?: string;
  compact?: boolean;
}

export type UploaderStatus = 'idle' | 'selected' | 'uploading' | 'uploaded' | 'failed';

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onUploadSuccess,
  defaultType = 'Aadhaar Card',
  initialVerificationStatus = 'verified',
  buttonLabel = 'Upload Document',
  compact = false,
}) => {
  const { user } = useAuth();
  const [docType, setDocType] = useState<DocumentCategoryType>(defaultType);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<UploaderStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [uploadedDoc, setUploadedDoc] = useState<UserDocument | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  const maxSizeBytes = 10 * 1024 * 1024; // 10MB

  // Clean up object URL when file changes or on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setStatus('idle');
    setUploadedDoc(null);

    // Revoke prior blob URL
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    if (!e.target.files || e.target.files.length === 0) return;

    const selectedFile = e.target.files[0];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Unsupported file type. Please upload a PDF, PNG, or JPG document.');
      setFile(null);
      setStatus('failed');
      return;
    }

    if (selectedFile.size > maxSizeBytes) {
      setError('File size exceeds the 10MB limit. Please upload a smaller file.');
      setFile(null);
      setStatus('failed');
      return;
    }

    // Set file & create preview for images
    setFile(selectedFile);
    setStatus('selected');

    if (selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleClearFile = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    setStatus('idle');
    setError(null);
    setUploadedDoc(null);
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleUpload = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!file) {
      setError('Please select a file before uploading.');
      return;
    }
    if (!user) {
      setError('You must be signed in to upload documents.');
      return;
    }

    setStatus('uploading');
    setError(null);

    const docId = crypto.randomUUID();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${user.id}/${docId}/${sanitizedFileName}`;

    try {
      // 1. Upload to Supabase Storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .upload(storagePath, file, {
          contentType: file.type,
          upsert: true,
        });

      if (storageError) {
        if (storageError.message.toLowerCase().includes('bucket not found')) {
          throw new Error(
            'Supabase Storage bucket "documents" not found. Please ensure the bucket exists in your Supabase project.'
          );
        }
        throw new Error(storageError.message || 'Failed to upload document file to storage.');
      }

      // 2. Insert record in documents table
      const newDocRecord = {
        id: docId,
        user_id: user.id,
        document_type: docType,
        file_name: file.name,
        storage_path: storagePath,
        mime_type: file.type,
        file_size: file.size,
        verification_status: initialVerificationStatus,
        uploaded_at: new Date().toISOString(),
      };

      const { data: dbData, error: dbError } = await supabase
        .from('documents')
        .insert(newDocRecord)
        .select()
        .single();

      if (dbError) {
        // Storage succeeded, but database metadata insert failed! Clean up orphaned file
        try {
          await supabase.storage.from('documents').remove([storagePath]);
        } catch (cleanupErr) {
          console.warn('Orphan cleanup warning:', cleanupErr);
        }

        throw new Error(
          `Database metadata save failed: ${dbError.message || 'Could not record document'}. The storage upload was safely rolled back.`
        );
      }

      const savedDoc = (dbData || newDocRecord) as UserDocument;
      setUploadedDoc(savedDoc);
      setStatus('uploaded');

      if (onUploadSuccess) {
        onUploadSuccess(savedDoc);
      }
    } catch (err: any) {
      setStatus('failed');
      setError(err.message || 'An unexpected error occurred while uploading.');
    }
  };

  const isImage = file?.type.startsWith('image/') || /\.(jpe?g|png)$/i.test(file?.name || '');

  return (
    <div
      className={`bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-2xl ${
        compact ? 'p-4' : 'p-6'
      } shadow-sm space-y-4 transition-colors`}
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Upload to Vault</h4>
        </div>

        {/* Status Pill */}
        {status === 'selected' && (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            Selected (Not Uploaded)
          </span>
        )}
        {status === 'uploading' && (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Uploading...</span>
          </span>
        )}
        {status === 'uploaded' && (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Uploaded & Saved</span>
          </span>
        )}
        {status === 'failed' && (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            Upload Failed
          </span>
        )}
      </div>

      {error && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-start gap-2 text-xs text-rose-800 dark:text-rose-200">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {status === 'uploaded' && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl flex items-center justify-between gap-2 text-xs text-emerald-800 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <p className="font-semibold">
              {uploadedDoc ? `"${uploadedDoc.file_name}" successfully saved to your encrypted vault.` : 'Document successfully saved to your encrypted vault.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClearFile}
            className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline shrink-0"
          >
            Upload Another
          </button>
        </div>
      )}

      <div className="space-y-3">
        {/* Document Category Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Document Category
          </label>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value as DocumentCategoryType)}
            className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            disabled={status === 'uploading'}
          >
            {DOCUMENT_TYPE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Selected File Area or Dropzone */}
        {!file ? (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Choose Document
            </label>
            <div className="border-2 border-dashed border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 rounded-xl p-4 bg-slate-50 dark:bg-zinc-900/40 text-center transition">
              <input
                type="file"
                id="file-upload"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
                disabled={status === 'uploading'}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
              >
                <div className="p-2 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline">
                    Browse files
                  </span>{' '}
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    or drag & drop
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  PDF, JPG, or PNG (Max 10 MB)
                </span>
              </label>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 space-y-3">
            <div className="flex items-center gap-3">
              {/* Thumbnail preview */}
              {isImage && previewUrl ? (
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="relative group w-14 h-14 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700 shrink-0 bg-white dark:bg-black cursor-pointer shadow-xs"
                  title="Click to zoom preview"
                >
                  <img
                    src={previewUrl}
                    alt={file.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                </button>
              ) : (
                <div className="w-14 h-14 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-500 shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="font-bold text-xs text-slate-900 dark:text-white truncate">{file.name}</p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  <span className="font-mono">{formatFileSize(file.size)}</span>
                  <span>•</span>
                  <span>{file.type || 'document'}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {status === 'selected' && 'Selected locally. Ready to upload.'}
                  {status === 'uploading' && 'Transferring to encrypted storage...'}
                  {status === 'uploaded' && 'Stored in Supabase documents.'}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                {isImage && previewUrl && (
                  <button
                    type="button"
                    onClick={() => setIsPreviewOpen(true)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-800 transition"
                    title="Preview image"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                )}

                <label
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-800 transition cursor-pointer"
                  title="Replace file"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleClearFile}
                  disabled={status === 'uploading'}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-zinc-800 transition disabled:opacity-50"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Action Button */}
        <button
          type="button"
          onClick={() => handleUpload()}
          disabled={!file || status === 'uploading' || status === 'uploaded'}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-sm disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          {status === 'uploading' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Uploading to Storage & Saving Metadata...</span>
            </>
          ) : status === 'uploaded' ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Saved in Vault</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>{buttonLabel}</span>
            </>
          )}
        </button>
      </div>

      {/* Modal Preview */}
      {previewUrl && (
        <FilePreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title={docType}
          fileName={file?.name || 'Document Preview'}
          fileSize={file?.size}
          mimeType={file?.type}
          previewUrl={previewUrl}
          isPdf={file?.type === 'application/pdf'}
        />
      )}
    </div>
  );
};
