import { Service } from '../types';

export const SERVICES_DATA: Service[] = [
  {
    id: 'aadhaar-update',
    name: 'Aadhaar Update',
    description: 'Update personal details, biometric info, or home address in your Aadhaar record.',
    category: 'Identity',
    fee: '₹50 - ₹100',
    processingTime: '5 - 15 working days',
    requiredDocuments: [
      { id: 'doc-poi', name: 'Proof of Identity (POI)', description: 'Passport, PAN, Voter ID, or Driving License', required: true, category: 'identity' },
      { id: 'doc-poa', name: 'Proof of Address (POA)', description: 'Electricity Bill, Bank Passbook, or Rent Agreement', required: true, category: 'address' },
      { id: 'doc-dob', name: 'Proof of Date of Birth (DOB)', description: 'Birth Certificate or SSLC Marksheet', required: false, category: 'identity' }
    ],
    steps: ['Prepare Documents', 'Verify Details', 'Book Appointment / Online Request', 'Biometric/Doc Submission', 'Track Status']
  },
  {
    id: 'pan-correction',
    name: 'PAN Correction',
    description: 'Correct or update information, photograph, or address associated with your PAN.',
    category: 'Taxation',
    fee: '₹110',
    processingTime: '7 - 10 working days',
    requiredDocuments: [
      { id: 'doc-identity', name: 'Proof of Identity', description: 'Aadhaar Card, Passport, or Voter ID', required: true, category: 'identity' },
      { id: 'doc-address', name: 'Proof of Address', description: 'Utility Bill, Bank Statement, or Aadhaar', required: true, category: 'address' },
      { id: 'doc-pan', name: 'Existing PAN Proof', description: 'Copy of PAN card or Allotment Letter', required: true, category: 'existing' },
      { id: 'doc-photo', name: 'Passport Photo', description: 'Recent color photograph with white background', required: true, category: 'photo' }
    ],
    steps: ['Prepare Documents', 'Check Mismatches', 'Fill NSDL Form', 'Submit Physical/e-Sign', 'Receive Updated Card']
  },
  {
    id: 'passport-application',
    name: 'Passport Application',
    description: 'Understand documents, fee tiers, and appointment steps for a fresh passport.',
    category: 'Travel & Immigration',
    fee: '₹1,500 (Fresh / Normal)',
    processingTime: '15 - 30 working days',
    requiredDocuments: [
      { id: 'doc-birth', name: 'Proof of Birth', description: 'Birth Certificate or Aadhaar Card', required: true, category: 'identity' },
      { id: 'doc-address-p', name: 'Proof of Present Address', description: 'Aadhaar, Bank Passbook, or Utility Bill', required: true, category: 'address' },
      { id: 'doc-non-ecr', name: 'Non-ECR Proof', description: '10th Standard Pass Certificate or Higher Degree', required: false, category: 'identity' }
    ],
    steps: ['Gather Requirements', 'Pre-Check Documents', 'Submit Passport Seva Form', 'PSK Visit', 'Police Verification']
  }
];