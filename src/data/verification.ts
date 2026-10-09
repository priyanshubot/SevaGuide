import { VerificationResult } from '../types';

export const MOCK_VERIFICATION_RESULTS: Record<string, VerificationResult> = {
  'pan-correction': {
    serviceId: 'pan-correction',
    overallStatus: 'WARNING',
    totalDocuments: 3,
    warningsCount: 1,
    errorsCount: 0,
    fieldChecks: [
      { fieldName: 'Full Name', status: 'PASS', extractedValue: 'Priyanshu Pandey', message: 'Name matches consistently across uploaded ID documents.' },
      { fieldName: 'Date of Birth', status: 'PASS', extractedValue: '12 Apr 2005', message: 'DOB strictly matches secondary proof.' },
      { fieldName: 'Address Detail', status: 'WARNING', extractedValue: 'Bhilai, Chhattisgarh', message: 'House number formatting differs slightly between POA and PAN application.' }
    ],
    extractedOcrData: {
      'Full Name': 'Priyanshu Pandey',
      'Date of Birth': '12/04/2005',
      'Extracted Address': 'Sector 6, Bhilai, Chhattisgarh - 490006',
      'Document Type Detected': 'Identity Card / Address Proof'
    }
  }
};