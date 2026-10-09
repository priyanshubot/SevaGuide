import { CandidatePanData } from './panParser';

export interface VerificationFieldCheck {
  fieldName: string;
  status: 'PASS' | 'WARNING' | 'ERROR' | 'INFO';
  extractedValue?: string;
  message: string;
}

export interface VerificationEvaluation {
  serviceId: string;
  overallStatus: 'PASS' | 'WARNING' | 'ERROR' | 'NEEDS_REVIEW';
  warningsCount: number;
  errorsCount: number;
  fieldChecks: VerificationFieldCheck[];
  extractedOcrData: Record<string, string>;
  isOcrProcessed: boolean;
  ocrConfidence: number;
  disclaimer: string;
}

export const VERIFICATION_DISCLAIMER =
  'Notice: This is an automated pre-submission consistency check. SevaGuide does not authenticate government records or verify data against official databases (e.g., NSDL, UTIITSL, or Income Tax Department). Always bring original documents to authorized facilitation centers.';

/**
 * Normalizes name strings by removing honorifics, punctuation, and extra whitespace.
 */
export function normalizeNameTokens(name: string): string[] {
  const honorifics = new Set(['MR', 'MRS', 'MS', 'SHRI', 'SMT', 'DR', 'KUMAR', 'KUMARI']);
  return name
    .toUpperCase()
    .replace(/[^A-Z\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 0 && !honorifics.has(token));
}

/**
 * Compares an extracted candidate name with an applicant reference name.
 * Handles exact matches, token permutations, and initials/abbreviations gracefully.
 */
export function compareNames(
  extracted: string,
  reference: string
): { matchType: 'EXACT' | 'PERMUTATION' | 'PARTIAL' | 'MISMATCH'; message: string } {
  const extractedTokens = normalizeNameTokens(extracted);
  const refTokens = normalizeNameTokens(reference);

  if (extractedTokens.length === 0 || refTokens.length === 0) {
    return {
      matchType: 'MISMATCH',
      message: 'Name comparison could not be performed due to missing name tokens.',
    };
  }

  const extractedJoined = extractedTokens.join(' ');
  const refJoined = refTokens.join(' ');

  // 1. Exact match
  if (extractedJoined === refJoined) {
    return {
      matchType: 'EXACT',
      message: 'Extracted cardholder name matches applicant reference name exactly.',
    };
  }

  // 2. Token permutation (e.g. "Pandey Priyanshu" vs "Priyanshu Pandey")
  const extractedSorted = [...extractedTokens].sort().join(' ');
  const refSorted = [...refTokens].sort().join(' ');
  if (extractedSorted === refSorted) {
    return {
      matchType: 'PERMUTATION',
      message: 'Extracted name tokens match applicant reference name with alternate order.',
    };
  }

  // 3. Initials or substring overlap (e.g. "P. Pandey" vs "Priyanshu Pandey")
  const allRefTokensInExtracted = refTokens.every((rt) =>
    extractedTokens.some((et) => et === rt || (et.length === 1 && rt.startsWith(et)))
  );
  const allExtractedTokensInRef = extractedTokens.every((et) =>
    refTokens.some((rt) => rt === et || (et.length === 1 && rt.startsWith(et)))
  );

  const sharedTokens = extractedTokens.filter((et) =>
    refTokens.some((rt) => rt === et || (et.length === 1 && rt.startsWith(et)) || (rt.length === 1 && et.startsWith(rt)))
  );

  if (allRefTokensInExtracted || allExtractedTokensInRef || sharedTokens.length >= Math.min(extractedTokens.length, refTokens.length)) {
    return {
      matchType: 'PARTIAL',
      message: 'Extracted name closely matches reference with initials or abbreviations. Please confirm at verification counter.',
    };
  }

  return {
    matchType: 'MISMATCH',
    message: `Extracted candidate name "${extracted}" does not match applicant reference "${reference}".`,
  };
}

/**
 * Evaluates candidate PAN card data against consistency rules and reference applicant data.
 */
export function evaluatePanVerification(
  panData: CandidatePanData,
  serviceId: string = 'pan-correction',
  referenceApplicantName?: string
): VerificationEvaluation {
  const fieldChecks: VerificationFieldCheck[] = [];
  const extractedOcrData: Record<string, string> = {};

  // 1. Text Extraction & Document Detection Check
  if (!panData.rawText || panData.rawText.trim().length === 0) {
    fieldChecks.push({
      fieldName: 'Text Extraction',
      status: 'ERROR',
      message: 'No readable text could be extracted. The image may be blank, severely blurred, or poorly lit.',
    });
  } else if (panData.ocrConfidence < 40) {
    fieldChecks.push({
      fieldName: 'Text Extraction',
      status: 'WARNING',
      extractedValue: `OCR Confidence: ${panData.ocrConfidence}%`,
      message: 'Image text was extracted with low OCR confidence. Some characters may contain scan errors.',
    });
  } else {
    fieldChecks.push({
      fieldName: 'Text Extraction',
      status: 'PASS',
      extractedValue: `OCR Confidence: ${panData.ocrConfidence}%`,
      message: 'Document text extracted with sufficient character recognition confidence.',
    });
  }

  // 2. PAN Document Type Check
  if (panData.isPanDocument) {
    fieldChecks.push({
      fieldName: 'Document Identifier',
      status: 'PASS',
      extractedValue: 'PAN Card / Tax Document',
      message: 'Identified standard Indian PAN card headings or structural identifiers.',
    });
    extractedOcrData['Document Detected'] = 'Indian PAN Card';
  } else {
    fieldChecks.push({
      fieldName: 'Document Identifier',
      status: 'WARNING',
      extractedValue: 'Unrecognized Document',
      message: 'Could not detect standard "Income Tax Department" or "Permanent Account Number" headings.',
    });
    extractedOcrData['Document Detected'] = 'Unknown / Non-standard Format';
  }

  // 3. PAN Number Format & Entity Check
  if (panData.candidatePanNumber) {
    const isValidSyntax = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panData.candidatePanNumber);
    extractedOcrData['Permanent Account Number (PAN)'] = panData.candidatePanNumber;

    if (isValidSyntax) {
      const entityChar = panData.candidatePanNumber[3];
      if (entityChar === 'P') {
        fieldChecks.push({
          fieldName: 'PAN Number Format',
          status: 'PASS',
          extractedValue: panData.candidatePanNumber,
          message: 'Valid 10-character PAN syntax for an Individual entity (4th character "P").',
        });
      } else {
        fieldChecks.push({
          fieldName: 'PAN Number Format',
          status: 'WARNING',
          extractedValue: panData.candidatePanNumber,
          message: `Valid PAN format, but entity type is ${panData.entityType || entityChar}. Ensure this matches your applicant status.`,
        });
      }
    } else {
      fieldChecks.push({
        fieldName: 'PAN Number Format',
        status: 'WARNING',
        extractedValue: panData.candidatePanNumber,
        message: 'Extracted candidate sequence does not strictly adhere to standard 10-character format.',
      });
    }
  } else {
    fieldChecks.push({
      fieldName: 'PAN Number Format',
      status: 'ERROR',
      message: 'Could not locate a candidate 10-character PAN number. Please verify image clarity.',
    });
  }

  // 4. Cardholder Name Check
  if (panData.candidateName) {
    extractedOcrData['Cardholder Name'] = panData.candidateName;

    if (referenceApplicantName && referenceApplicantName.trim().length > 0) {
      const nameComparison = compareNames(panData.candidateName, referenceApplicantName);

      if (nameComparison.matchType === 'EXACT') {
        fieldChecks.push({
          fieldName: 'Applicant Name Check',
          status: 'PASS',
          extractedValue: panData.candidateName,
          message: nameComparison.message,
        });
      } else if (nameComparison.matchType === 'PERMUTATION') {
        fieldChecks.push({
          fieldName: 'Applicant Name Check',
          status: 'PASS',
          extractedValue: panData.candidateName,
          message: nameComparison.message,
        });
      } else if (nameComparison.matchType === 'PARTIAL') {
        fieldChecks.push({
          fieldName: 'Applicant Name Check',
          status: 'WARNING',
          extractedValue: panData.candidateName,
          message: nameComparison.message,
        });
      } else {
        fieldChecks.push({
          fieldName: 'Applicant Name Check',
          status: 'WARNING',
          extractedValue: panData.candidateName,
          message: `${nameComparison.message} (Reference: "${referenceApplicantName}").`,
        });
      }
    } else {
      fieldChecks.push({
        fieldName: 'Applicant Name Check',
        status: 'INFO',
        extractedValue: panData.candidateName,
        message: 'Candidate name extracted from document. No reference name provided for cross-comparison.',
      });
    }
  } else {
    fieldChecks.push({
      fieldName: 'Applicant Name Check',
      status: 'WARNING',
      message: 'Cardholder name could not be automatically extracted from image.',
    });
  }

  // 5. Date of Birth Check
  if (panData.candidateDob) {
    extractedOcrData['Date of Birth'] = panData.candidateDob;

    // Validate date parts
    const parts = panData.candidateDob.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    const isValidDate = day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900 && year <= new Date().getFullYear();

    if (isValidDate) {
      fieldChecks.push({
        fieldName: 'Date of Birth (DOB)',
        status: 'PASS',
        extractedValue: panData.candidateDob,
        message: 'Valid date of birth format and calendar sequence detected.',
      });
    } else {
      fieldChecks.push({
        fieldName: 'Date of Birth (DOB)',
        status: 'WARNING',
        extractedValue: panData.candidateDob,
        message: 'Extracted date sequence contains irregular calendar day/month values.',
      });
    }
  } else {
    fieldChecks.push({
      fieldName: 'Date of Birth (DOB)',
      status: 'WARNING',
      message: 'Date of birth could not be extracted automatically. Please enter manually if needed.',
    });
  }

  // 6. Father's Name (Optional informational)
  if (panData.candidateFatherName) {
    extractedOcrData["Father's Name"] = panData.candidateFatherName;
    fieldChecks.push({
      fieldName: "Father's Name",
      status: 'INFO',
      extractedValue: panData.candidateFatherName,
      message: "Candidate father's name identified from document layout.",
    });
  }

  // Calculate overall status
  const errorsCount = fieldChecks.filter((c) => c.status === 'ERROR').length;
  const warningsCount = fieldChecks.filter((c) => c.status === 'WARNING').length;

  let overallStatus: 'PASS' | 'WARNING' | 'ERROR' | 'NEEDS_REVIEW' = 'PASS';
  if (errorsCount > 0) {
    overallStatus = 'ERROR';
  } else if (warningsCount > 0) {
    overallStatus = 'WARNING';
  }

  return {
    serviceId,
    overallStatus,
    warningsCount,
    errorsCount,
    fieldChecks,
    extractedOcrData,
    isOcrProcessed: true,
    ocrConfidence: panData.ocrConfidence,
    disclaimer: VERIFICATION_DISCLAIMER,
  };
}
