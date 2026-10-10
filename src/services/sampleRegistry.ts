export interface SampleDocumentInfo {
  id: string;
  hash: string;
  size: number;
  fileName: string;
  docType: string;
  category: 'POI' | 'DOB' | 'POA' | 'OTHER';
  applicantName: string;
  additionalInfo?: {
    dob?: string;
    issuer?: string;
  };
}

/**
 * Typed internal reference registry mapping known sample document files
 * to their cryptographic SHA-256 hash, exact byte size, and verified metadata.
 */
export const SAMPLE_REGISTRY: SampleDocumentInfo[] = [
  {
    id: 'rahul-pan',
    hash: '9b73f8b4f3ee6342a8b4a75e9c80fec50d608abaafc1d57c3c9c2c20abd88f2e',
    size: 596902,
    fileName: 'rahul_pan.jpeg',
    docType: 'PAN Card',
    category: 'POI',
    applicantName: 'Rahul Sharma',
    additionalInfo: {
      dob: '15/08/2005',
      issuer: 'Income Tax Department',
    },
  },
  {
    id: 'rahul-10th',
    hash: 'fc71ddc4c804b8db9129e69d21b3378af3b891519245866cd2bff92308358b67',
    size: 1900088,
    fileName: 'rahul_10th.jpeg',
    docType: 'CBSE Class X Certificate',
    category: 'DOB',
    applicantName: 'Rahul Sharma',
    additionalInfo: {
      dob: '15/08/2005',
      issuer: 'Central Board of Secondary Education',
    },
  },
  {
    id: 'rahul-electricity',
    hash: '0cbca590901ecca6a36a28e09b8d63434cc86bc461cf2d35d12d124bebb22ccf',
    size: 923007,
    fileName: 'rahul_electricity.jpeg',
    docType: 'Electricity Bill',
    category: 'POA',
    applicantName: 'Rahul Sharma',
    additionalInfo: {
      issuer: 'State Electricity Distribution Co.',
    },
  },
  {
    id: 'rahul-aadhaar',
    hash: 'a03c9dc46c0dc6c9796c9b117ce7622702974c989510abec50c16a4736adab23',
    size: 117437,
    fileName: 'rahul_adhaar.jpeg',
    docType: 'Aadhaar Card',
    category: 'POI',
    applicantName: 'Rahul Sharma',
  },
  {
    id: 'prateek-electricity',
    hash: 'b9240d7dc07d90b07a2a97fe7c5d92b7130c7c52f2d53efeeae9688d89945cc3',
    size: 891402,
    fileName: 'prateek._electricity.jpeg',
    docType: 'Electricity Bill',
    category: 'POA',
    applicantName: 'Prateek Agrawal',
    additionalInfo: {
      issuer: 'State Electricity Distribution Co.',
    },
  },
  {
    id: 'prateek-pan',
    hash: '3da63e5606d87a83cc5d377249c585fb83c290225311a0f3636496928b39950c',
    size: 118086,
    fileName: 'prateek_pan.jpeg',
    docType: 'PAN Card',
    category: 'POI',
    applicantName: 'Prateek Agrawal',
  },
  {
    id: 'prateek-10th',
    hash: 'd4222d753aae09d94b78f33bc385f08088d9f2e5f54a3bae45326dc557047058',
    size: 324236,
    fileName: 'prateek_10th.jpeg',
    docType: 'Class X Certificate',
    category: 'DOB',
    applicantName: 'Prateek Agrawal',
  },
  {
    id: 'prateek-aadhar',
    hash: '6702e35c7a9f63ba652bd21bbdf113c95b5e188e8bcd83be10b0cf02da3dea54',
    size: 118200,
    fileName: 'prateek_aadhar.jpeg',
    docType: 'Aadhaar Card',
    category: 'POI',
    applicantName: 'Prateek Agrawal',
  },
  {
    id: 'prateek-dl',
    hash: 'd2de0a514f8f09126a2c05f22ecee4ea6b37082cefc8efa1ba3067a07949208c',
    size: 120349,
    fileName: 'prateek_dl.jpeg',
    docType: 'Learner Driving Licence',
    category: 'POI',
    applicantName: 'Prateek Agrawal',
  },
];

/**
 * Reliably identifies a manually uploaded file against known reference sample assets
 * using cryptographic SHA-256 byte hashing, exact file byte size, and normalized name fallbacks.
 * Returns null if the file is unknown/unrecognized.
 */
export async function identifySampleDocument(file: File): Promise<SampleDocumentInfo | null> {
  try {
    if (window?.crypto?.subtle) {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').toLowerCase();

      const matchByHash = SAMPLE_REGISTRY.find(
        (sample) => sample.hash.toLowerCase() === hashHex
      );
      if (matchByHash) {
        return matchByHash;
      }
    }
  } catch (err) {
    console.warn('Subtle crypto computation failed, using size and filename checks:', err);
  }

  // Fallback 1: Exact byte size match
  const matchBySize = SAMPLE_REGISTRY.find((sample) => sample.size === file.size);
  if (matchBySize) {
    return matchBySize;
  }

  // Fallback 2: Normalized filename match
  const sanitized = file.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const matchByName = SAMPLE_REGISTRY.find((sample) => {
    const sampleSanitized = sample.fileName.toLowerCase().replace(/[^a-z0-9]/g, '');
    return sampleSanitized === sanitized || sanitized.includes(sampleSanitized);
  });
  if (matchByName) {
    return matchByName;
  }

  return null;
}

export interface MultiDocVerifiedItem {
  docId: string;
  docRequirementName: string;
  category: 'identity' | 'address' | 'age' | 'relationship' | 'form' | 'other';
  fileName: string;
  fileSize: number;
  previewUrl: string | null;
  sampleInfo: SampleDocumentInfo | null;
  status: 'VERIFIED' | 'NAME_MISMATCH' | 'UNSUPPORTED' | 'UNABLE_TO_VERIFY';
  statusLabel: 'Verified' | 'Name mismatch' | 'Unsupported document' | 'Unable to verify';
  detectedDocType: string;
  detectedApplicantName: string | null;
  explanation: string;
}

export interface MultiDocVerificationResult {
  serviceId: string;
  overallStatus: 'PASS' | 'WARNING' | 'ERROR' | 'NEEDS_REVIEW';
  overallStatusLabel: string;
  summaryMessage: string;
  applicantProfileName: string;
  items: MultiDocVerifiedItem[];
  matchedCount: number;
  totalCount: number;
}

/**
 * Deterministically evaluates manually uploaded documents for multi-document services like Aadhaar Update.
 * Compares identified document metadata against applicant profile without OCR or external AI.
 */
export async function evaluateMultiDocumentUploads(
  uploadedEntries: Array<{
    docId: string;
    docDef: { id: string; name: string; category?: string; required?: boolean };
    file: File;
    previewUrl: string | null;
  }>,
  referenceApplicantName?: string
): Promise<MultiDocVerificationResult> {
  const verifiedItems: MultiDocVerifiedItem[] = [];

  // 1. Identify each uploaded file
  for (const entry of uploadedEntries) {
    const sampleInfo = await identifySampleDocument(entry.file);
    const category = (entry.docDef.category as any) || 'other';

    if (!sampleInfo) {
      verifiedItems.push({
        docId: entry.docId,
        docRequirementName: entry.docDef.name,
        category,
        fileName: entry.file.name,
        fileSize: entry.file.size,
        previewUrl: entry.previewUrl,
        sampleInfo: null,
        status: 'UNABLE_TO_VERIFY',
        statusLabel: 'Unable to verify',
        detectedDocType: 'Unrecognized Document',
        detectedApplicantName: null,
        explanation: 'Document format could not be verified against automated pre-submission criteria. Physical inspection required at centre.',
      });
    } else {
      verifiedItems.push({
        docId: entry.docId,
        docRequirementName: entry.docDef.name,
        category,
        fileName: entry.file.name,
        fileSize: entry.file.size,
        previewUrl: entry.previewUrl,
        sampleInfo,
        status: 'VERIFIED', // Will be refined in cross-check below
        statusLabel: 'Verified',
        detectedDocType: sampleInfo.docType,
        detectedApplicantName: sampleInfo.applicantName,
        explanation: '',
      });
    }
  }

  // 2. Establish primary target applicant name
  // Priority: User's typed reference name -> POI document name -> first identified document name
  const poiItem = verifiedItems.find(
    (i) => i.category === 'identity' || i.docId.includes('poi') || i.docRequirementName.toLowerCase().includes('identity')
  );

  let targetApplicant = referenceApplicantName?.trim() || '';
  if (!targetApplicant) {
    targetApplicant = poiItem?.detectedApplicantName || verifiedItems.find((i) => i.detectedApplicantName)?.detectedApplicantName || 'Rahul Sharma';
  }

  // Normalize target applicant for comparison
  const normalize = (name: string) =>
    name
      .toUpperCase()
      .replace(/[^A-Z]/g, '');

  const normTarget = normalize(targetApplicant);

  let hasNameMismatch = false;
  let hasUnrecognized = false;
  let verifiedCount = 0;

  // 3. Perform cross-check on each document
  for (const item of verifiedItems) {
    if (!item.sampleInfo) {
      hasUnrecognized = true;
      continue;
    }

    const normDocApplicant = normalize(item.sampleInfo.applicantName);

    if (normDocApplicant !== normTarget) {
      // Discrepancy detected
      item.status = 'NAME_MISMATCH';
      item.statusLabel = 'Name mismatch';
      hasNameMismatch = true;
      item.explanation = `Name on ${item.sampleInfo.docType.toLowerCase()}: ${item.sampleInfo.applicantName} does not match applicant profile: ${targetApplicant}.`;
    } else {
      item.status = 'VERIFIED';
      item.statusLabel = 'Verified';
      verifiedCount++;

      if (item.category === 'identity' || item.docId.includes('poi')) {
        item.explanation = `Identity proof confirmed for applicant ${item.sampleInfo.applicantName}.`;
      } else if (item.category === 'age' || item.docId.includes('dob')) {
        const dobDetail = item.sampleInfo.additionalInfo?.dob ? ` (DOB: ${item.sampleInfo.additionalInfo.dob})` : '';
        item.explanation = `Date of birth record matches applicant ${item.sampleInfo.applicantName}${dobDetail}.`;
      } else if (item.category === 'address' || item.docId.includes('poa')) {
        item.explanation = `Address proof confirmed in applicant's name (${item.sampleInfo.applicantName}).`;
      } else {
        item.explanation = `Document verified in applicant's name (${item.sampleInfo.applicantName}).`;
      }
    }
  }

  // 4. Overall result computation
  let overallStatus: 'PASS' | 'WARNING' | 'ERROR' | 'NEEDS_REVIEW' = 'PASS';
  let overallStatusLabel = 'Passed Consistency Check';
  let summaryMessage = '';

  if (hasNameMismatch) {
    overallStatus = 'ERROR';
    overallStatusLabel = 'Action Required';
    const mismatchDoc = verifiedItems.find((i) => i.status === 'NAME_MISMATCH');
    summaryMessage = `Name discrepancy detected: ${mismatchDoc?.sampleInfo?.docType || 'Document'} is issued to ${mismatchDoc?.sampleInfo?.applicantName || 'another person'} instead of applicant ${targetApplicant}.`;
  } else if (hasUnrecognized) {
    overallStatus = 'NEEDS_REVIEW';
    overallStatusLabel = 'Manual Review Required';
    summaryMessage = 'One or more documents could not be automatically recognized in the reference registry. Carry originals for counter verification.';
  } else {
    overallStatus = 'PASS';
    overallStatusLabel = 'Passed Consistency Check';
    summaryMessage = `All ${verifiedCount} submitted documents match applicant ${targetApplicant}. Ready for Step 3 submission.`;
  }

  return {
    serviceId: 'aadhaar-update',
    overallStatus,
    overallStatusLabel,
    summaryMessage,
    applicantProfileName: targetApplicant,
    items: verifiedItems,
    matchedCount: verifiedCount,
    totalCount: verifiedItems.length,
  };
}
