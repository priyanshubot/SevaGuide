import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { SERVICES_DATA } from '../data/services';
import { ProcessSteps } from '../components/ProcessSteps';
import {
  DocumentRequirementCard,
  DocumentItemState,
} from '../components/DocumentRequirementCard';
import { FilePreviewModal } from '../components/FilePreviewModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { extractTextFromImage, OcrProgress, validateOcrFile } from '../services/ocr';
import { parsePanCardText, CandidatePanData } from '../services/panParser';
import {
  evaluatePanVerification,
  VerificationEvaluation,
  VERIFICATION_DISCLAIMER,
} from '../services/documentVerification';
import {
  AlertTriangle,
  CheckCircle,
  ShieldCheck,
  Loader2,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Edit3,
  RefreshCw,
  Info,
  Check,
  AlertCircle,
  Cpu,
  Save,
  HelpCircle,
} from 'lucide-react';

export const VerifyDocuments: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const location = useLocation();
  const service = SERVICES_DATA.find((s) => s.id === serviceId);
  const { user } = useAuth();

  // State map for all required document items
  const [documentStates, setDocumentStates] = useState<Record<string, DocumentItemState>>({});

  const [verifying, setVerifying] = useState(false);
  const [ocrProgress, setOcrProgress] = useState<OcrProgress | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Modals for preview and delete confirmation
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    title: string;
    fileName: string;
    previewUrl: string | null;
    fileSize?: number;
    mimeType?: string;
  }>({
    isOpen: false,
    title: '',
    fileName: '',
    previewUrl: null,
  });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    docId: string;
    fileName: string;
    documentType: string;
    isDeleting: boolean;
    actionType: 'delete' | 'replace';
    pendingFile?: File;
  }>({
    isOpen: false,
    docId: '',
    fileName: '',
    documentType: '',
    isDeleting: false,
    actionType: 'delete',
  });

  // Candidate parsed data & editable form fields
  const [candidateData, setCandidateData] = useState<CandidatePanData | null>(null);
  const [editableFields, setEditableFields] = useState({
    panNumber: '',
    name: '',
    fatherName: '',
    dob: '',
  });
  const [referenceApplicantName, setReferenceApplicantName] = useState<string>(() => {
    return user?.user_metadata?.full_name || '';
  });
  const [evaluation, setEvaluation] = useState<VerificationEvaluation | null>(null);
  const [primaryPersistedDocId, setPrimaryPersistedDocId] = useState<string | null>(null);
  const [savedUpdateNotice, setSavedUpdateNotice] = useState<boolean>(false);

  // Initialize document states when service changes
  useEffect(() => {
    if (!service) return;
    setDocumentStates((prev) => {
      const initial: Record<string, DocumentItemState> = { ...prev };
      service.requiredDocuments.forEach((doc) => {
        if (!initial[doc.id]) {
          initial[doc.id] = {
            docId: doc.id,
            file: null,
            previewUrl: null,
            status: 'idle',
            errorMessage: null,
          };
        }
      });
      return initial;
    });
  }, [service]);

  // Clean up any remaining object URLs on component unmount
  useEffect(() => {
    return () => {
      Object.values(documentStates).forEach((item) => {
        if (item.previewUrl && item.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, []);

  if (!service) return <div className="p-8 text-center text-slate-600">Service not found</div>;

  const mapDocType = (docName: string): string => {
    const name = docName.toLowerCase();
    if (name.includes('pan')) return 'PAN Card';
    if (name.includes('aadhaar')) return 'Aadhaar Card';
    if (name.includes('passport')) return 'Passport';
    if (name.includes('photo')) return 'Photograph';
    if (name.includes('address')) return 'Proof of Address';
    if (name.includes('identity')) return 'Proof of Identity';
    if (name.includes('birth') || name.includes('dob')) return 'Proof of Date of Birth';
    return 'Other';
  };

  // 1. File Selection Handler: shows immediate preview and sets status to 'selected'
  const handleSelectFile = (docId: string, file: File) => {
    setGeneralError(null);

    // Revoke old blob preview URL if present
    const existing = documentStates[docId];
    if (existing?.previewUrl && existing.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(existing.previewUrl);
    }

    const isOcrTarget =
      docId === 'doc-pan' ||
      docId.includes('pan') ||
      service.requiredDocuments.find((d) => d.id === docId)?.name.toLowerCase().includes('pan');

    if (isOcrTarget) {
      const val = validateOcrFile(file);
      if (!val.valid) {
        setDocumentStates((prev) => ({
          ...prev,
          [docId]: {
            docId,
            file: null,
            previewUrl: null,
            status: 'failed',
            errorMessage: val.error || 'Invalid file format.',
          },
        }));
        return;
      }
    }

    // Create immediate local object URL for preview
    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;

    setDocumentStates((prev) => ({
      ...prev,
      [docId]: {
        docId,
        file,
        previewUrl,
        status: 'selected', // Explicitly selected, NOT yet uploaded!
        errorMessage: null,
        storagePath: null,
        persistedDbId: null,
        signedUrl: null,
      },
    }));
  };

  // 2. Remove Local File
  const handleRemoveLocalFile = (docId: string) => {
    const existing = documentStates[docId];
    if (existing?.previewUrl && existing.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(existing.previewUrl);
    }
    setDocumentStates((prev) => ({
      ...prev,
      [docId]: {
        docId,
        file: null,
        previewUrl: null,
        status: 'idle',
        errorMessage: null,
        storagePath: null,
        persistedDbId: null,
        signedUrl: null,
      },
    }));
  };

  // 3. Initiate Delete of already uploaded file
  const handleInitiateDeleteUploaded = (docId: string, actionType: 'delete' | 'replace' = 'delete', pendingFile?: File) => {
    const existing = documentStates[docId];
    if (!existing) return;

    if (!existing.storagePath && !existing.persistedDbId) {
      // It was only selected locally
      if (actionType === 'replace' && pendingFile) {
        handleSelectFile(docId, pendingFile);
      } else {
        handleRemoveLocalFile(docId);
      }
      return;
    }

    const req = service.requiredDocuments.find((d) => d.id === docId);
    setDeleteModal({
      isOpen: true,
      docId,
      fileName: existing.file?.name || 'Uploaded Document',
      documentType: req?.name || 'Document',
      isDeleting: false,
      actionType,
      pendingFile,
    });
  };

  // 4. Confirm Deletion in Modal
  const handleConfirmDelete = async () => {
    const { docId, actionType, pendingFile } = deleteModal;
    const existing = documentStates[docId];
    if (!existing) return;

    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

    try {
      if (existing.storagePath) {
        await supabase.storage.from('documents').remove([existing.storagePath]);
      }
      if (existing.persistedDbId) {
        await supabase.from('documents').delete().eq('id', existing.persistedDbId);
      }

      if (actionType === 'replace' && pendingFile) {
        handleSelectFile(docId, pendingFile);
      } else {
        handleRemoveLocalFile(docId);
      }

      setDeleteModal((prev) => ({ ...prev, isOpen: false, isDeleting: false }));
    } catch (err: any) {
      console.warn('Deletion error:', err);
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  // 5. Upload Single Document to Supabase
  const handleUploadSingleDocument = async (docId: string): Promise<string | null> => {
    const item = documentStates[docId];
    if (!item?.file) return null;

    if (!user) {
      setDocumentStates((prev) => ({
        ...prev,
        [docId]: {
          ...prev[docId],
          status: 'failed',
          errorMessage: 'Sign in to upload documents to your private encrypted vault.',
        },
      }));
      return null;
    }

    setDocumentStates((prev) => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        status: 'uploading',
        errorMessage: null,
      },
    }));

    const req = service.requiredDocuments.find((d) => d.id === docId);
    const docType = req ? mapDocType(req.name) : 'Proof of Identity';
    const primaryId = item.persistedDbId || crypto.randomUUID();
    const safeName = item.file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${user.id}/${primaryId}/${safeName}`;

    try {
      // Step A: Upload to Supabase Storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .upload(storagePath, item.file, { contentType: item.file.type, upsert: true });

      if (storageError) {
        throw new Error(storageError.message || 'Failed to upload document file to storage.');
      }

      // Step B: Insert or update record in public.documents
      const docRecord = {
        id: primaryId,
        user_id: user.id,
        document_type: docType,
        file_name: item.file.name,
        storage_path: storagePath,
        mime_type: item.file.type,
        file_size: item.file.size,
        verification_status: 'pending',
        uploaded_at: new Date().toISOString(),
      };

      const { error: dbError } = await supabase.from('documents').upsert(docRecord);

      if (dbError) {
        // Handle orphaned file by rolling back storage upload
        try {
          await supabase.storage.from('documents').remove([storagePath]);
        } catch (cleanupErr) {
          console.warn('Storage cleanup rollback warning:', cleanupErr);
        }
        throw new Error(
          `Database metadata save failed: ${dbError.message}. The storage upload was safely rolled back.`
        );
      }

      // Step C: Generate authorized signed URL for secure private preview
      let signedUrl = item.previewUrl;
      try {
        const { data: signedData } = await supabase.storage
          .from('documents')
          .createSignedUrl(storagePath, 3600);
        if (signedData?.signedUrl) {
          signedUrl = signedData.signedUrl;
        }
      } catch (e) {
        console.warn('Signed URL fetch error:', e);
      }

      setDocumentStates((prev) => ({
        ...prev,
        [docId]: {
          ...prev[docId],
          status: 'uploaded',
          storagePath,
          persistedDbId: primaryId,
          signedUrl,
          errorMessage: null,
        },
      }));

      return primaryId;
    } catch (err: any) {
      setDocumentStates((prev) => ({
        ...prev,
        [docId]: {
          ...prev[docId],
          status: 'failed',
          errorMessage: err.message || 'Upload failed.',
        },
      }));
      return null;
    }
  };

  // Preview modal opener
  const handleOpenPreview = (docId: string) => {
    const item = documentStates[docId];
    if (!item?.file && !item?.signedUrl) return;
    const req = service.requiredDocuments.find((d) => d.id === docId);

    setPreviewModal({
      isOpen: true,
      title: req?.name || 'Document Preview',
      fileName: item.file?.name || 'Document',
      previewUrl: item.signedUrl || item.previewUrl,
      fileSize: item.file?.size,
      mimeType: item.file?.type,
    });
  };

  // Helper to generate a realistic sample PAN card image for instant zero-setup testing
  const handleLoadSamplePanCard = async () => {
    setGeneralError(null);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 750;
      canvas.height = 450;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 4;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

      ctx.fillStyle = '#0369a1';
      ctx.fillRect(10, 10, canvas.width - 20, 75);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('INCOME TAX DEPARTMENT', canvas.width / 2, 44);
      ctx.font = 'bold 15px Arial, sans-serif';
      ctx.fillText('GOVT. OF INDIA', canvas.width / 2, 68);

      ctx.fillStyle = '#334155';
      ctx.font = 'bold 15px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Permanent Account Number Card', canvas.width / 2, 115);

      ctx.textAlign = 'left';
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 11px Arial, sans-serif';

      ctx.fillText('PERMANENT ACCOUNT NUMBER', 50, 155);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 26px monospace';
      ctx.fillText('ABCPE1234F', 50, 185);

      const testName = (user?.user_metadata?.full_name || 'PRIYANSHU SHARMA').toUpperCase();
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 11px Arial, sans-serif';
      ctx.fillText('NAME', 50, 225);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 17px Arial, sans-serif';
      ctx.fillText(testName, 50, 248);

      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 11px Arial, sans-serif';
      ctx.fillText("FATHER'S NAME", 50, 288);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 15px Arial, sans-serif';
      ctx.fillText('RAMESH SHARMA', 50, 310);

      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 11px Arial, sans-serif';
      ctx.fillText('DATE OF BIRTH', 50, 350);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 16px Arial, sans-serif';
      ctx.fillText('15/08/1995', 50, 372);

      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(canvas.width - 180, 140, 130, 160);
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 12px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('CITIZEN PHOTO', canvas.width - 115, 225);

      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.strokeRect(canvas.width - 180, 320, 130, 50);
      ctx.font = 'italic 16px Georgia, serif';
      ctx.fillStyle = '#1e293b';
      ctx.fillText('P. Sharma', canvas.width - 115, 350);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const file = new File([blob], 'sample_pan_card.png', { type: 'image/png' });
        const targetReq =
          service.requiredDocuments.find((d) => d.id === 'doc-pan' || d.name.toLowerCase().includes('pan')) ||
          service.requiredDocuments[0];

        handleSelectFile(targetReq.id, file);
      }, 'image/png');
    } catch (e) {
      console.warn('Sample generation error', e);
    }
  };

  // Re-evaluates verification checks whenever user corrects candidate values
  const recomputeEvaluation = (
    currentFields: typeof editableFields,
    currentRefName: string,
    baseData: CandidatePanData
  ) => {
    const updatedCandidate: CandidatePanData = {
      ...baseData,
      candidatePanNumber: currentFields.panNumber.trim().toUpperCase() || null,
      candidateName: currentFields.name.trim() || null,
      candidateFatherName: currentFields.fatherName.trim() || null,
      candidateDob: currentFields.dob.trim() || null,
    };

    const evaluated = evaluatePanVerification(
      updatedCandidate,
      service.id,
      currentRefName.trim() || undefined
    );
    setEvaluation(evaluated);
    return evaluated;
  };

  const handleFieldChange = (field: keyof typeof editableFields, value: string) => {
    const updated = { ...editableFields, [field]: value };
    setEditableFields(updated);
    if (candidateData) {
      recomputeEvaluation(updated, referenceApplicantName, candidateData);
    }
  };

  const handleRefNameChange = (newName: string) => {
    setReferenceApplicantName(newName);
    if (candidateData) {
      recomputeEvaluation(editableFields, newName, candidateData);
    }
  };

  const handleSaveUpdatedFields = async () => {
    if (!user || !primaryPersistedDocId || !candidateData) return;
    setSyncStatus('Saving field corrections to Supabase...');

    try {
      const ocrPayload = {
        candidatePanNumber: editableFields.panNumber,
        candidateName: editableFields.name,
        candidateFatherName: editableFields.fatherName,
        candidateDob: editableFields.dob,
        referenceApplicantName: referenceApplicantName,
        ocrConfidence: candidateData.ocrConfidence,
        overallStatus: evaluation?.overallStatus || 'PASS',
        userEdited: true,
        updatedAt: new Date().toISOString(),
      };

      await supabase
        .from('documents')
        .update({
          ocr_data: ocrPayload,
          verification_status:
            evaluation?.overallStatus === 'PASS'
              ? 'verified'
              : evaluation?.overallStatus === 'WARNING'
              ? 'warning'
              : 'error',
          updated_at: new Date().toISOString(),
        })
        .eq('id', primaryPersistedDocId);

      setSavedUpdateNotice(true);
      setTimeout(() => setSavedUpdateNotice(false), 3000);
    } catch (e) {
      console.warn('Failed to update ocr_data in Supabase:', e);
    } finally {
      setSyncStatus(null);
    }
  };

  // Run Real OCR Pre-Submission Check
  const handleVerify = async () => {
    setGeneralError(null);

    // Check if at least one file has been selected or uploaded
    const chosenItems = Object.values(documentStates).filter((item) => Boolean(item.file));
    if (chosenItems.length === 0) {
      setGeneralError('Please choose or upload at least one document image before running the check.');
      return;
    }

    // Determine target PAN card item
    const panReq = service.requiredDocuments.find(
      (d) => d.id === 'doc-pan' || d.name.toLowerCase().includes('pan')
    );
    const targetItem = (panReq && documentStates[panReq.id]?.file)
      ? documentStates[panReq.id]
      : chosenItems[0];

    const targetFile = targetItem.file!;
    const validation = validateOcrFile(targetFile);
    if (!validation.valid) {
      setGeneralError(validation.error || 'The uploaded file is not supported for OCR.');
      return;
    }

    setVerifying(true);
    setOcrProgress({
      stage: 'loading',
      progress: 5,
      message: 'Initializing browser OCR engine (Tesseract.js)...',
    });

    // Mark target item as processing
    setDocumentStates((prev) => ({
      ...prev,
      [targetItem.docId]: {
        ...prev[targetItem.docId],
        status: 'processing',
      },
    }));

    try {
      // 1. Upload any selected files to Supabase if authenticated and not yet uploaded
      let primaryDocId = targetItem.persistedDbId || null;

      if (user) {
        setSyncStatus('Uploading documents to encrypted Supabase vault...');
        for (const item of chosenItems) {
          if (item.status === 'selected' || !item.persistedDbId) {
            const savedId = await handleUploadSingleDocument(item.docId);
            if (item.docId === targetItem.docId && savedId) {
              primaryDocId = savedId;
            }
          }
        }
      }

      // 2. Run real browser-side OCR text extraction
      const ocrResult = await extractTextFromImage(targetFile, (prog) => {
        setOcrProgress(prog);
      });

      // 3. Parse candidate PAN entities
      const parsedPan = parsePanCardText(
        ocrResult.rawText,
        ocrResult.lines,
        ocrResult.confidence
      );
      setCandidateData(parsedPan);

      const initialFields = {
        panNumber: parsedPan.candidatePanNumber || '',
        name: parsedPan.candidateName || '',
        fatherName: parsedPan.candidateFatherName || '',
        dob: parsedPan.candidateDob || '',
      };
      setEditableFields(initialFields);

      // 4. Rule-based evaluation
      const initialEvaluation = evaluatePanVerification(
        parsedPan,
        service.id,
        referenceApplicantName.trim() || undefined
      );
      setEvaluation(initialEvaluation);

      // 5. Update target item state to 'ready_for_review'
      setDocumentStates((prev) => ({
        ...prev,
        [targetItem.docId]: {
          ...prev[targetItem.docId],
          status: 'ready_for_review',
          ocrConfidence: parsedPan.ocrConfidence,
        },
      }));

      // 6. Update database with ocr_data payload if user is authenticated
      if (user && primaryDocId) {
        setPrimaryPersistedDocId(primaryDocId);
        const ocrPayload = {
          candidatePanNumber: parsedPan.candidatePanNumber,
          candidateName: parsedPan.candidateName,
          candidateFatherName: parsedPan.candidateFatherName,
          candidateDob: parsedPan.candidateDob,
          entityType: parsedPan.entityType,
          ocrConfidence: parsedPan.ocrConfidence,
          fieldChecks: initialEvaluation.fieldChecks,
          overallStatus: initialEvaluation.overallStatus,
          extractedAt: new Date().toISOString(),
        };

        const status =
          initialEvaluation.overallStatus === 'PASS'
            ? 'verified'
            : initialEvaluation.overallStatus === 'WARNING'
            ? 'warning'
            : 'error';

        await supabase
          .from('documents')
          .update({
            ocr_data: ocrPayload,
            verification_status: status,
            updated_at: new Date().toISOString(),
          })
          .eq('id', primaryDocId);

        // Upsert user application record
        try {
          const appId = `APP-${service.id.toUpperCase().slice(0, 4)}-${user.id.slice(0, 4).toUpperCase()}`;
          const appStatus =
            initialEvaluation.overallStatus === 'PASS' ? 'In Progress' : 'Action Required';

          await supabase.from('applications').upsert({
            id: appId,
            user_id: user.id,
            service_id: service.id,
            service_name: service.name,
            applicant_name: referenceApplicantName || user.user_metadata?.full_name || 'Citizen',
            status: appStatus,
            current_step_index: 1,
            last_updated: 'Today',
            updated_at: new Date().toISOString(),
          });
        } catch (appErr) {
          console.warn('Application record upsert warning:', appErr);
        }
      }

      setIsVerified(true);
    } catch (err: any) {
      console.warn('OCR verification error:', err);
      setGeneralError(err.message || 'An error occurred during OCR text extraction.');
      setDocumentStates((prev) => ({
        ...prev,
        [targetItem.docId]: {
          ...prev[targetItem.docId],
          status: 'failed',
          errorMessage: err.message || 'OCR processing failed.',
        },
      }));
    } finally {
      setVerifying(false);
      setOcrProgress(null);
      setSyncStatus(null);
    }
  };

  // Check if checklist state was passed or stored from Step 1
  const passedChecklist: Record<string, boolean> | null =
    (location.state as { checklistState?: Record<string, boolean> } | null)?.checklistState || (() => {
      try {
        const saved = localStorage.getItem(`sevaguide_checklist_${serviceId}`);
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    })();
  const readyChecklistCount = passedChecklist ? Object.values(passedChecklist).filter(Boolean).length : 0;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Navigation breadcrumb back to Page 1: Document Readiness Checklist */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <Link
          to={`/services/${service.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Document Readiness Checklist</span>
        </Link>
        {passedChecklist && (
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Step 1 Checklist:{' '}
            <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">
              {readyChecklistCount} of {service.requiredDocuments.length}
            </strong>{' '}
            marked ready
          </span>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 px-3 py-1 rounded-md w-fit mb-2 border border-blue-200 dark:border-blue-900">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
          <span>Pre-Submission Consistency Check</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {service.name} Document Check
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Select or upload documents to your encrypted vault. Run in-browser OCR for instant verification.
        </p>
      </div>

      <ProcessSteps steps={service.steps} currentStepIndex={1} />

      {generalError && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl flex items-start gap-3 text-xs text-rose-800 dark:text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
          <div>
            <p className="font-bold">Upload Notice</p>
            <p className="mt-0.5">{generalError}</p>
          </div>
        </div>
      )}

      {!isVerified ? (
        <div className="space-y-6">
          {/* Quick Demo Test Bar */}
          <div className="p-4 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200 font-medium">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>Want to test without a physical card? Generate a sample PAN card image instantly.</span>
            </div>
            <button
              type="button"
              onClick={handleLoadSamplePanCard}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition shrink-0 shadow-xs cursor-pointer"
            >
              Generate Sample PAN Image
            </button>
          </div>

          {/* Reference Applicant Name Input */}
          <div className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span>Applicant Reference Full Name</span>
                <span className="text-[11px] font-normal text-slate-400">(Cross-compared with document name)</span>
              </label>
              {user && (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Signed in as {user.email}
                </span>
              )}
            </div>
            <input
              type="text"
              value={referenceApplicantName}
              onChange={(e) => setReferenceApplicantName(e.target.value)}
              placeholder="e.g. PRIYANSHU SHARMA"
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>

          {/* Required Documents Upload List */}
          <div className="space-y-4">
            {service.requiredDocuments.map((doc) => {
              const isOcrTarget =
                doc.id === 'doc-pan' || doc.name.toLowerCase().includes('pan') || doc.category === 'existing';
              const itemState = documentStates[doc.id] || {
                docId: doc.id,
                file: null,
                previewUrl: null,
                status: 'idle',
              };

              return (
                <DocumentRequirementCard
                  key={doc.id}
                  doc={doc}
                  itemState={itemState}
                  onSelectFile={(f) => handleSelectFile(doc.id, f)}
                  onUploadFile={() => handleUploadSingleDocument(doc.id).then(() => {})}
                  onRemoveFile={() => handleRemoveLocalFile(doc.id)}
                  onDeleteUploadedFile={() => handleInitiateDeleteUploaded(doc.id, 'delete')}
                  onPreviewFile={() => handleOpenPreview(doc.id)}
                  isOcrTarget={isOcrTarget}
                  disabled={verifying}
                />
              );
            })}
          </div>

          {/* Progress Modal / Status */}
          {verifying && ocrProgress && (
            <div className="p-5 bg-white dark:bg-black border border-blue-200 dark:border-blue-900 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
                  <span>{ocrProgress.message}</span>
                </span>
                <span className="font-mono text-blue-600 dark:text-blue-400">{ocrProgress.progress}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-zinc-900 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${ocrProgress.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                <span>Stage: {ocrProgress.stage}</span>
                <span>Browser Web Worker • Zero external AI transmission</span>
              </div>
            </div>
          )}

          {/* Run Pre-Submission Button */}
          <div className="pt-2">
            <button
              onClick={handleVerify}
              disabled={verifying}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer"
            >
              {verifying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{syncStatus || ocrProgress?.message || 'Processing OCR & Verification...'}</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-5 h-5" />
                  <span>Upload & Run Real Pre-Submission Check</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center mt-2">
              Note: Automated consistency check. Image files are analyzed locally in your browser. No PII is sent to external AI servers.
            </p>
          </div>
        </div>
      ) : (
        /* Verified / Results View */
        <div className="space-y-6">
          {/* Top Result Banner */}
          <div className="bg-white dark:bg-black p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm transition-colors space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                {evaluation?.overallStatus === 'PASS' ? (
                  <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                ) : evaluation?.overallStatus === 'WARNING' ? (
                  <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Pre-Submission Result:</span>
                    <span
                      className={
                        evaluation?.overallStatus === 'PASS'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : evaluation?.overallStatus === 'WARNING'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }
                    >
                      {evaluation?.overallStatus === 'PASS'
                        ? 'Passed Consistency Check'
                        : evaluation?.overallStatus === 'WARNING'
                        ? 'Warnings Detected'
                        : 'Action Required'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {evaluation?.warningsCount} warning(s), {evaluation?.errorsCount} error(s) flagged
                  </p>
                </div>
              </div>

              {candidateData && (
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>OCR Confidence: {candidateData.ocrConfidence}%</span>
                  </span>
                </div>
              )}
            </div>

            {/* Candidate Review & Manual Correction Form */}
            <div className="bg-slate-50 dark:bg-zinc-950 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                    Citizen Review & Field Correction
                  </h4>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Did OCR misread a letter? Correct values below to immediately refresh validation.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* PAN Number */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>PAN Number</span>
                    {candidateData?.extractionConfidence.pan && (
                      <span className="text-[10px] font-mono text-slate-400">
                        {candidateData.extractionConfidence.pan} CONFIDENCE
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={editableFields.panNumber}
                    onChange={(e) => handleFieldChange('panNumber', e.target.value.toUpperCase())}
                    placeholder="e.g. ABCPE1234F"
                    className="w-full bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono font-bold tracking-widest text-slate-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                {/* Cardholder Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Cardholder Full Name</span>
                    {candidateData?.extractionConfidence.name && (
                      <span className="text-[10px] font-mono text-slate-400">
                        {candidateData.extractionConfidence.name} CONFIDENCE
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={editableFields.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    placeholder="e.g. PRIYANSHU SHARMA"
                    className="w-full bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                {/* Father's Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    <span>Father's Name (Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={editableFields.fatherName}
                    onChange={(e) => handleFieldChange('fatherName', e.target.value)}
                    placeholder="e.g. RAMESH SHARMA"
                    className="w-full bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                {/* Date of Birth */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Date of Birth (DD/MM/YYYY)</span>
                    {candidateData?.extractionConfidence.dob && (
                      <span className="text-[10px] font-mono text-slate-400">
                        {candidateData.extractionConfidence.dob} CONFIDENCE
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={editableFields.dob}
                    onChange={(e) => handleFieldChange('dob', e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="w-full bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Reference Name Cross-check setting */}
              <div className="pt-2 border-t border-slate-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Reference Name:</span>
                  <input
                    type="text"
                    value={referenceApplicantName}
                    onChange={(e) => handleRefNameChange(e.target.value)}
                    placeholder="Reference Applicant Name"
                    className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>

                {user && primaryPersistedDocId && (
                  <button
                    type="button"
                    onClick={handleSaveUpdatedFields}
                    disabled={Boolean(syncStatus)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition shadow-xs disabled:opacity-60 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{syncStatus ? 'Saving...' : 'Save Field Corrections to Vault'}</span>
                  </button>
                )}
              </div>

              {savedUpdateNotice && (
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Field updates successfully saved to your document record in Supabase!</span>
                </div>
              )}
            </div>

            {/* Field Checks Breakdown */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Rule-Based Verification Breakdown
              </h4>

              {evaluation?.fieldChecks.map((check, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl text-xs flex items-start gap-3 border transition ${
                    check.status === 'PASS'
                      ? 'bg-slate-50 dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800'
                      : check.status === 'WARNING'
                      ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
                      : check.status === 'ERROR'
                      ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                      : 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50'
                  }`}
                >
                  {check.status === 'PASS' ? (
                    <CheckCircle className="text-emerald-600 dark:text-emerald-400 w-4 h-4 shrink-0 mt-0.5" />
                  ) : check.status === 'WARNING' ? (
                    <AlertTriangle className="text-amber-500 w-4 h-4 shrink-0 mt-0.5" />
                  ) : check.status === 'ERROR' ? (
                    <AlertCircle className="text-rose-500 w-4 h-4 shrink-0 mt-0.5" />
                  ) : (
                    <Info className="text-blue-500 w-4 h-4 shrink-0 mt-0.5" />
                  )}

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-slate-800 dark:text-slate-200">{check.fieldName}</p>
                      {check.extractedValue && (
                        <span className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-black px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-800">
                          {check.extractedValue}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {check.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Official Disclaimer Alert */}
            <div className="p-4 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Pre-Submission Disclaimer</span>
              </div>
              <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                {VERIFICATION_DISCLAIMER}
              </p>
            </div>

            {/* Saved to Vault Notice */}
            {user && (
              <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/60 rounded-xl text-xs text-emerald-900 dark:text-emerald-200">
                <p className="font-semibold">Documents & OCR structured data saved to your account</p>
                <p className="text-emerald-800 dark:text-emerald-300 text-[11px] mt-0.5">
                  Your document and candidate OCR readings are securely encrypted in your Supabase vault.
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsVerified(false);
                    setCandidateData(null);
                    setEvaluation(null);
                  }}
                  className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-800 dark:text-slate-200 font-semibold px-4 py-2.5 rounded-xl text-xs border border-transparent dark:border-zinc-800 transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Check Another Document</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition shadow-sm"
                >
                  <span>View in My Documents</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to={`/offices/${service.id}`}
                  className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-800 dark:text-slate-200 font-semibold px-4 py-2.5 rounded-xl text-xs border border-transparent dark:border-zinc-800 transition"
                >
                  <span>Find Facilitation Office</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      <FilePreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal((prev) => ({ ...prev, isOpen: false }))}
        title={previewModal.title}
        fileName={previewModal.fileName}
        fileSize={previewModal.fileSize}
        mimeType={previewModal.mimeType}
        previewUrl={previewModal.previewUrl}
        isPdf={previewModal.mimeType === 'application/pdf'}
      />

      {/* Delete / Replace Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        fileName={deleteModal.fileName}
        documentType={deleteModal.documentType}
        isDeleting={deleteModal.isDeleting}
        actionType={deleteModal.actionType}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};