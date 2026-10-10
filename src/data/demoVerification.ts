export interface DemoDocumentMetadata {
  id: string;
  category: 'POI' | 'DOB' | 'POA' | 'OTHER';
  categoryLabel: string;
  docType: string;
  fileName: string;
  assetPath: string;
  applicantName: string;
  additionalDetails?: {
    dob?: string;
    documentNumber?: string;
    addressLine?: string;
    issuer?: string;
  };
}

export type DemoScenarioId = 'scenario-a' | 'scenario-b';

export interface DemoItemVerification {
  category: 'POI' | 'DOB' | 'POA';
  categoryLabel: string;
  fieldChecked: 'Identity' | 'Date of birth' | 'Address';
  docType: string;
  fileName: string;
  assetPath: string;
  applicantOnDoc: string;
  targetApplicant: string;
  status: 'MATCHED' | 'MISMATCH';
  statusLabel: 'Matched' | 'Name mismatch';
  explanation: string;
  details?: string;
}

export interface DemoScenario {
  id: DemoScenarioId;
  name: string;
  buttonLabel: string;
  badgeLabel: string;
  description: string;
  targetApplicant: string;
  overallStatus: 'PASS' | 'ATTENTION REQUIRED';
  matchedCount: number;
  totalCount: number;
  documents: DemoItemVerification[];
}

/**
 * Manifest of sample demo files present in public/demo-documents/
 */
export const DEMO_SAMPLE_DOCUMENTS: DemoDocumentMetadata[] = [
  {
    id: 'rahul-pan',
    category: 'POI',
    categoryLabel: 'Proof of Identity (PoI)',
    docType: 'PAN Card',
    fileName: 'rahul_pan.jpeg',
    assetPath: '/demo-documents/rahul_pan.jpeg',
    applicantName: 'Rahul Sharma',
    additionalDetails: {
      dob: '15/08/2005',
      issuer: 'Income Tax Department, Govt. of India',
    },
  },
  {
    id: 'rahul-10th',
    category: 'DOB',
    categoryLabel: 'Proof of Date of Birth (DoB)',
    docType: 'CBSE Class X Certificate',
    fileName: 'rahul_10th.jpeg',
    assetPath: '/demo-documents/rahul_10th.jpeg',
    applicantName: 'Rahul Sharma',
    additionalDetails: {
      dob: '15/08/2005',
      issuer: 'Central Board of Secondary Education (CBSE)',
    },
  },
  {
    id: 'rahul-electricity',
    category: 'POA',
    categoryLabel: 'Proof of Address (PoA)',
    docType: 'Electricity Bill',
    fileName: 'rahul_electricity.jpeg',
    assetPath: '/demo-documents/rahul_electricity.jpeg',
    applicantName: 'Rahul Sharma',
    additionalDetails: {
      issuer: 'State Power Distribution Co. Ltd.',
    },
  },
  {
    id: 'prateek-electricity',
    category: 'POA',
    categoryLabel: 'Proof of Address (PoA)',
    docType: 'Electricity Bill',
    fileName: 'prateek._electricity.jpeg',
    assetPath: '/demo-documents/prateek._electricity.jpeg',
    applicantName: 'Prateek Agrawal',
    additionalDetails: {
      issuer: 'State Power Distribution Co. Ltd.',
    },
  },
  {
    id: 'rahul-aadhaar',
    category: 'OTHER',
    categoryLabel: 'Aadhaar Card',
    docType: 'Aadhaar Card',
    fileName: 'rahul_adhaar.jpeg',
    assetPath: '/demo-documents/rahul_adhaar.jpeg',
    applicantName: 'Rahul Sharma',
  },
  {
    id: 'prateek-pan',
    category: 'POI',
    categoryLabel: 'Proof of Identity (PoI)',
    docType: 'PAN Card',
    fileName: 'prateek_pan.jpeg',
    assetPath: '/demo-documents/prateek_pan.jpeg',
    applicantName: 'Prateek Agrawal',
  },
  {
    id: 'prateek-10th',
    category: 'DOB',
    categoryLabel: 'Proof of Date of Birth (DoB)',
    docType: 'Class X Certificate',
    fileName: 'prateek_10th.jpeg',
    assetPath: '/demo-documents/prateek_10th.jpeg',
    applicantName: 'Prateek Agrawal',
  },
  {
    id: 'prateek-aadhar',
    category: 'OTHER',
    categoryLabel: 'Aadhaar Card',
    docType: 'Aadhaar Card',
    fileName: 'prateek_aadhar.jpeg',
    assetPath: '/demo-documents/prateek_aadhar.jpeg',
    applicantName: 'Prateek Agrawal',
  },
  {
    id: 'prateek-dl',
    category: 'OTHER',
    categoryLabel: 'Driving Licence',
    docType: 'Learner Driving Licence',
    fileName: 'prateek_dl.jpeg',
    assetPath: '/demo-documents/prateek_dl.jpeg',
    applicantName: 'Prateek Agrawal',
  },
];

/**
 * Deterministic Demo Scenarios for Aadhaar Update & Correction
 */
export const DEMO_SCENARIOS: Record<DemoScenarioId, DemoScenario> = {
  'scenario-a': {
    id: 'scenario-a',
    name: 'Scenario A: All documents match',
    buttonLabel: 'All Documents Match',
    badgeLabel: 'Scenario A',
    description: 'All 3 documents belong to applicant Rahul Sharma with consistent identity, date of birth, and address information.',
    targetApplicant: 'Rahul Sharma',
    overallStatus: 'PASS',
    matchedCount: 3,
    totalCount: 3,
    documents: [
      {
        category: 'POI',
        categoryLabel: 'Proof of Identity (PoI)',
        fieldChecked: 'Identity',
        docType: 'PAN Card',
        fileName: 'rahul_pan.jpeg',
        assetPath: '/demo-documents/rahul_pan.jpeg',
        applicantOnDoc: 'Rahul Sharma',
        targetApplicant: 'Rahul Sharma',
        status: 'MATCHED',
        statusLabel: 'Matched',
        explanation: 'Applicant name "Rahul Sharma" matches target profile.',
        details: 'Photo identity record valid and verified.',
      },
      {
        category: 'DOB',
        categoryLabel: 'Proof of Date of Birth (DoB)',
        fieldChecked: 'Date of birth',
        docType: 'CBSE Class X Certificate',
        fileName: 'rahul_10th.jpeg',
        assetPath: '/demo-documents/rahul_10th.jpeg',
        applicantOnDoc: 'Rahul Sharma',
        targetApplicant: 'Rahul Sharma',
        status: 'MATCHED',
        statusLabel: 'Matched',
        explanation: 'Applicant name "Rahul Sharma" matches target profile.',
        details: 'DOB (15/08/2005) recorded in official school marksheet.',
      },
      {
        category: 'POA',
        categoryLabel: 'Proof of Address (PoA)',
        fieldChecked: 'Address',
        docType: 'Electricity Bill',
        fileName: 'rahul_electricity.jpeg',
        assetPath: '/demo-documents/rahul_electricity.jpeg',
        applicantOnDoc: 'Rahul Sharma',
        targetApplicant: 'Rahul Sharma',
        status: 'MATCHED',
        statusLabel: 'Matched',
        explanation: 'Address proof issued in applicant\'s name "Rahul Sharma".',
        details: 'Recent utility bill within permissible 3-month window.',
      },
    ],
  },
  'scenario-b': {
    id: 'scenario-b',
    name: 'Scenario B: Applicant name mismatch',
    buttonLabel: 'Show Name Mismatch',
    badgeLabel: 'Scenario B',
    description: 'Address proof contains a name discrepancy (Prateek Agrawal vs. applicant Rahul Sharma).',
    targetApplicant: 'Rahul Sharma',
    overallStatus: 'ATTENTION REQUIRED',
    matchedCount: 2,
    totalCount: 3,
    documents: [
      {
        category: 'POI',
        categoryLabel: 'Proof of Identity (PoI)',
        fieldChecked: 'Identity',
        docType: 'PAN Card',
        fileName: 'rahul_pan.jpeg',
        assetPath: '/demo-documents/rahul_pan.jpeg',
        applicantOnDoc: 'Rahul Sharma',
        targetApplicant: 'Rahul Sharma',
        status: 'MATCHED',
        statusLabel: 'Matched',
        explanation: 'Applicant name "Rahul Sharma" matches target profile.',
        details: 'Photo identity record valid and verified.',
      },
      {
        category: 'DOB',
        categoryLabel: 'Proof of Date of Birth (DoB)',
        fieldChecked: 'Date of birth',
        docType: 'CBSE Class X Certificate',
        fileName: 'rahul_10th.jpeg',
        assetPath: '/demo-documents/rahul_10th.jpeg',
        applicantOnDoc: 'Rahul Sharma',
        targetApplicant: 'Rahul Sharma',
        status: 'MATCHED',
        statusLabel: 'Matched',
        explanation: 'Applicant name "Rahul Sharma" matches target profile.',
        details: 'DOB (15/08/2005) recorded in official school marksheet.',
      },
      {
        category: 'POA',
        categoryLabel: 'Proof of Address (PoA)',
        fieldChecked: 'Address',
        docType: 'Electricity Bill',
        fileName: 'prateek._electricity.jpeg',
        assetPath: '/demo-documents/prateek._electricity.jpeg',
        applicantOnDoc: 'Prateek Agrawal',
        targetApplicant: 'Rahul Sharma',
        status: 'MISMATCH',
        statusLabel: 'Name mismatch',
        explanation: 'Name on electricity bill: Prateek Agrawal does not match applicant name: Rahul Sharma.',
        details: 'Name mismatch detected between electricity bill (Prateek Agrawal) and target applicant (Rahul Sharma). UIDAI requires utility bills to be in the applicant\'s own name or accompanied by relationship proof.',
      },
    ],
  },
};

export const DEMO_VERIFICATION_DISCLAIMER =
  'Demo only. Results use predefined sample metadata and do not represent official UIDAI verification.';
