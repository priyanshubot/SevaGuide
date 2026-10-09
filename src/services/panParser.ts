export interface CandidatePanData {
  isPanDocument: boolean;
  candidatePanNumber: string | null;
  candidateName: string | null;
  candidateFatherName: string | null;
  candidateDob: string | null;
  entityType: string | null;
  rawText: string;
  ocrConfidence: number;
  extractionConfidence: {
    pan: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
    name: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
    dob: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  };
  notes: string[];
  warnings: string[];
}

const PAN_REGEX = /\b([A-Z]{5})([0-9]{4})([A-Z]{1})\b/;
const PAN_LOOSE_REGEX = /\b([A-Za-z]{5})\s*[-_]?\s*([0-9]{4})\s*[-_]?\s*([A-Za-z]{1})\b/;
const DOB_REGEX = /\b(0[1-9]|[12][0-9]|3[01])[\/\-\.](0[1-9]|1[012])[\/\-\.](19\d\d|20\d\d)\b/;

const ENTITY_TYPE_MAP: Record<string, string> = {
  P: 'Individual (P)',
  C: 'Company (C)',
  H: 'Hindu Undivided Family (H)',
  A: 'Association of Persons (A)',
  B: 'Body of Individuals (B)',
  G: 'Government Agency (G)',
  J: 'Artificial Juridical Person (J)',
  L: 'Local Authority (L)',
  F: 'Firm / LLP (F)',
  T: 'Trust (T)',
};

const HEADER_KEYWORDS = [
  'INCOME TAX DEPARTMENT',
  'INCOMETAX DEPARTMENT',
  'GOVT. OF INDIA',
  'GOVT OF INDIA',
  'GOVERNMENT OF INDIA',
  'PERMANENT ACCOUNT NUMBER',
  'PERMANENT ACCOUNT NUMBER CARD',
  'SIGNATURE',
  'INCOME TAX',
  'आयकर विभाग',
  'भारत सरकार',
];

/**
 * Parses raw OCR text extracted from an image and detects candidate PAN card fields.
 * Candidate values are heuristic extractions for human review, not verified government records.
 */
export function parsePanCardText(
  rawText: string,
  lines: string[],
  ocrConfidence: number
): CandidatePanData {
  const upperText = rawText.toUpperCase();
  const notes: string[] = [];
  const warnings: string[] = [];

  // 1. Detect if this appears to be a PAN document
  const hasPanHeader = HEADER_KEYWORDS.some((kw) => upperText.includes(kw));
  let candidatePanNumber: string | null = null;
  let panConfidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE' = 'NONE';
  let entityType: string | null = null;

  // 2. Extract PAN number
  const exactMatch = upperText.match(PAN_REGEX);
  if (exactMatch) {
    candidatePanNumber = exactMatch[0];
    panConfidence = ocrConfidence >= 60 ? 'HIGH' : 'MEDIUM';
    const entityChar = candidatePanNumber[3];
    entityType = ENTITY_TYPE_MAP[entityChar] || `Category (${entityChar})`;
    notes.push(`Candidate PAN ${candidatePanNumber} matches standard 10-character alphanumeric structure.`);
  } else {
    // Attempt loose matching (spaces between groups)
    const looseMatch = upperText.match(PAN_LOOSE_REGEX);
    if (looseMatch) {
      const reconstructed = `${looseMatch[1]}${looseMatch[2]}${looseMatch[3]}`.toUpperCase();
      candidatePanNumber = reconstructed;
      panConfidence = 'MEDIUM';
      const entityChar = reconstructed[3];
      entityType = ENTITY_TYPE_MAP[entityChar] || `Category (${entityChar})`;
      notes.push(`Candidate PAN reconstructed from spaced OCR characters: ${candidatePanNumber}.`);
    } else {
      warnings.push('Could not locate a candidate 10-character PAN number matching standard formatting.');
    }
  }

  const isPanDocument = hasPanHeader || Boolean(candidatePanNumber);

  // 3. Extract Date of Birth
  let candidateDob: string | null = null;
  let dobConfidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE' = 'NONE';
  const dobMatch = rawText.match(DOB_REGEX);

  if (dobMatch) {
    // Standardize separator to /
    candidateDob = dobMatch[0].replace(/[\-\.]/g, '/');
    dobConfidence = ocrConfidence >= 60 ? 'HIGH' : 'MEDIUM';
    notes.push(`Extracted candidate date of birth: ${candidateDob}.`);
  } else {
    warnings.push('Date of birth could not be identified automatically from the image.');
  }

  // 4. Extract Cardholder Name and Father's Name
  let candidateName: string | null = null;
  let candidateFatherName: string | null = null;
  let nameConfidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE' = 'NONE';

  // Strategy A: Look for labeled lines
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check for "NAME" label
    if (/^(NAME|नाम)\b/i.test(line) && !/FATHER/i.test(line)) {
      const inlineVal = line.replace(/^(NAME|नाम)[:\s\-\.]+/i, '').trim();
      if (inlineVal.length > 2 && /^[A-Za-z\s\.]+$/.test(inlineVal)) {
        candidateName = inlineVal.toUpperCase();
        nameConfidence = 'HIGH';
      } else if (i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        if (/^[A-Za-z\s\.]+$/.test(nextLine) && nextLine.length > 2) {
          candidateName = nextLine.toUpperCase();
          nameConfidence = 'HIGH';
        }
      }
    }

    // Check for "FATHER" label
    if (/(FATHER|पिता)/i.test(line)) {
      const inlineVal = line.replace(/^(FATHER'S\s+NAME|FATHERS\s+NAME|पिता\s+का\s+नाम)[:\s\-\.]+/i, '').trim();
      if (inlineVal.length > 2 && /^[A-Za-z\s\.]+$/.test(inlineVal)) {
        candidateFatherName = inlineVal.toUpperCase();
      } else if (i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        if (/^[A-Za-z\s\.]+$/.test(nextLine) && nextLine.length > 2) {
          candidateFatherName = nextLine.toUpperCase();
        }
      }
    }
  }

  // Strategy B: Positional parsing between header lines and DOB/PAN
  if (!candidateName) {
    const cleanAlphaLines: string[] = [];

    for (const rawLine of lines) {
      const clean = rawLine.replace(/[^A-Za-z\s]/g, ' ').replace(/\s+/g, ' ').trim();
      const upperClean = clean.toUpperCase();

      if (clean.length < 3) continue;

      // Skip lines that match header keywords
      const isHeader = HEADER_KEYWORDS.some((kw) => upperClean.includes(kw));
      const isDobOrPan =
        (candidatePanNumber && upperClean.includes(candidatePanNumber)) ||
        (candidateDob && rawLine.includes(candidateDob)) ||
        upperClean.includes('DATE') ||
        upperClean.includes('BIRTH');

      if (!isHeader && !isDobOrPan) {
        // Must contain only letters and whitespace
        if (/^[A-Z\s]{3,}$/.test(upperClean) && !upperClean.includes('INDIA')) {
          cleanAlphaLines.push(upperClean);
        }
      }
    }

    if (cleanAlphaLines.length > 0) {
      candidateName = cleanAlphaLines[0];
      nameConfidence = 'MEDIUM';
      if (cleanAlphaLines.length > 1) {
        candidateFatherName = cleanAlphaLines[1];
      }
      notes.push(`Candidate name identified from document layout: ${candidateName}.`);
    } else {
      warnings.push('Cardholder name could not be reliably parsed. Please review or enter manually.');
    }
  }

  if (ocrConfidence < 45) {
    warnings.push('Overall OCR reading confidence is low. Text may contain scanning artifacts or character errors.');
  }

  return {
    isPanDocument,
    candidatePanNumber,
    candidateName,
    candidateFatherName,
    candidateDob,
    entityType,
    rawText,
    ocrConfidence,
    extractionConfidence: {
      pan: panConfidence,
      name: nameConfidence,
      dob: dobConfidence,
    },
    notes,
    warnings,
  };
}
