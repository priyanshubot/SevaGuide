import { FamilyMember, FamilyDocument } from '../types/family';

export const DEMO_FAMILY_MEMBERS: Omit<FamilyMember, 'user_id'>[] = [
  {
    id: 'demo-fam-1',
    management_id: 'FAM-2026-001',
    full_name: 'Aarav Sharma',
    relationship: 'Father',
    date_of_birth: '1968-05-14',
    email: 'aarav.sharma.demo@example.com',
    phone: '+91 98765 43210',
    notes: 'Primary household pension and property record holder.',
    is_demo: true,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z'
  },
  {
    id: 'demo-fam-2',
    management_id: 'FAM-2026-002',
    full_name: 'Meera Sharma',
    relationship: 'Mother',
    date_of_birth: '1972-08-22',
    email: 'meera.sharma.demo@example.com',
    phone: '+91 98765 43211',
    notes: 'Nominee for family welfare benefits and ration quota.',
    is_demo: true,
    created_at: '2026-01-12T11:30:00Z',
    updated_at: '2026-01-12T11:30:00Z'
  },
  {
    id: 'demo-fam-3',
    management_id: 'FAM-2026-003',
    full_name: 'Riya Sharma',
    relationship: 'Sister',
    date_of_birth: '1998-11-03',
    email: 'riya.sharma.demo@example.com',
    phone: '+91 98765 43212',
    notes: 'Pursuing higher studies; scholarships and degree certificates.',
    is_demo: true,
    created_at: '2026-01-15T09:15:00Z',
    updated_at: '2026-01-15T09:15:00Z'
  },
  {
    id: 'demo-fam-4',
    management_id: 'FAM-2026-004',
    full_name: 'Kabir Sharma',
    relationship: 'Brother',
    date_of_birth: '2004-03-29',
    email: 'kabir.sharma.demo@example.com',
    phone: '+91 98765 43213',
    notes: 'Undergraduate student; applying for driving licence and passport.',
    is_demo: true,
    created_at: '2026-01-18T14:45:00Z',
    updated_at: '2026-01-18T14:45:00Z'
  }
];

export const DEMO_FAMILY_DOCUMENTS: Omit<FamilyDocument, 'user_id'>[] = [
  // Aarav Sharma's documents
  {
    id: 'demo-doc-1',
    family_member_id: 'demo-fam-1',
    title: 'Aadhaar Identification Document Copy',
    category: 'Identity Proof',
    status: 'Verified',
    file_name: 'aarav_sharma_id_copy.pdf',
    file_size: 420000,
    notes: 'Internal record matches birth year and full name.',
    uploaded_at: '2026-01-10T10:15:00Z',
    updated_at: '2026-01-10T10:15:00Z'
  },
  {
    id: 'demo-doc-2',
    family_member_id: 'demo-fam-1',
    title: 'Electricity Utility Bill (Recent Quarter)',
    category: 'Address Proof',
    status: 'Verified',
    file_name: 'delhi_bijli_bill_2026.pdf',
    file_size: 512000,
    notes: 'Address verified matching Delhi NCT residence.',
    uploaded_at: '2026-01-10T10:20:00Z',
    updated_at: '2026-01-10T10:20:00Z'
  },
  {
    id: 'demo-doc-3',
    family_member_id: 'demo-fam-1',
    title: 'Annual Income Certificate 2025-26',
    category: 'Income Certificate',
    status: 'Pending Review',
    file_name: 'income_declaration_father.pdf',
    file_size: 380000,
    notes: 'Submitted for verification under revenue department guidelines.',
    uploaded_at: '2026-02-01T15:00:00Z',
    updated_at: '2026-02-01T15:00:00Z'
  },

  // Meera Sharma's documents
  {
    id: 'demo-doc-4',
    family_member_id: 'demo-fam-2',
    title: 'Voter Photo Identity Record',
    category: 'Identity Proof',
    status: 'Verified',
    file_name: 'epic_card_meera_sharma.pdf',
    file_size: 340000,
    notes: 'Valid photo electoral identity on file.',
    uploaded_at: '2026-01-12T11:45:00Z',
    updated_at: '2026-01-12T11:45:00Z'
  },
  {
    id: 'demo-doc-5',
    family_member_id: 'demo-fam-2',
    title: 'Ration Card Endorsement Copy',
    category: 'Address Proof',
    status: 'Needs Attention',
    file_name: 'ration_card_page2.pdf',
    file_size: 290000,
    notes: 'Address discrepancy noted with previous ward re-delimitation. Re-upload required.',
    uploaded_at: '2026-01-14T09:10:00Z',
    updated_at: '2026-01-14T09:10:00Z'
  },
  {
    id: 'demo-doc-6',
    family_member_id: 'demo-fam-2',
    title: 'Municipal Birth Certificate Record',
    category: 'Birth Certificate',
    status: 'Verified',
    file_name: 'municipal_birth_record_1972.pdf',
    file_size: 610000,
    notes: 'Clear stamped registrar certificate.',
    uploaded_at: '2026-01-12T11:55:00Z',
    updated_at: '2026-01-12T11:55:00Z'
  },

  // Riya Sharma's documents
  {
    id: 'demo-doc-7',
    family_member_id: 'demo-fam-3',
    title: 'Class 10 CBSE Board Passing Certificate',
    category: 'Educational Certificate',
    status: 'Verified',
    file_name: 'cbse_class10_passing_cert.pdf',
    file_size: 780000,
    notes: 'Verified date of birth and secondary credentials.',
    uploaded_at: '2026-01-15T09:30:00Z',
    updated_at: '2026-01-15T09:30:00Z'
  },
  {
    id: 'demo-doc-8',
    family_member_id: 'demo-fam-3',
    title: 'Passport Booklet (Pages 1-2 & 35-36)',
    category: 'Identity Proof',
    status: 'Pending Review',
    file_name: 'passport_scan_riya.pdf',
    file_size: 890000,
    notes: 'Awaiting visual clarity re-check of passport photo.',
    uploaded_at: '2026-02-05T12:00:00Z',
    updated_at: '2026-02-05T12:00:00Z'
  },
  {
    id: 'demo-doc-9',
    family_member_id: 'demo-fam-3',
    title: 'Community / Domicile Certificate Application Slip',
    category: 'Other Documents',
    status: 'Not Uploaded',
    notes: 'Document placeholder pending official issuance from district tehsildar.',
    updated_at: '2026-02-05T12:05:00Z'
  },

  // Kabir Sharma's documents
  {
    id: 'demo-doc-10',
    family_member_id: 'demo-fam-4',
    title: 'Hospital Birth Record Certificate',
    category: 'Birth Certificate',
    status: 'Verified',
    file_name: 'kabir_birth_registration.pdf',
    file_size: 450000,
    notes: 'Verified against local municipal corporation birth registry format.',
    uploaded_at: '2026-01-18T15:00:00Z',
    updated_at: '2026-01-18T15:00:00Z'
  },
  {
    id: 'demo-doc-11',
    family_member_id: 'demo-fam-4',
    title: 'College Photo Identity Card',
    category: 'Identity Proof',
    status: 'Verified',
    file_name: 'college_id_card_2025.pdf',
    file_size: 310000,
    notes: 'Active institutional identity document.',
    uploaded_at: '2026-01-18T15:10:00Z',
    updated_at: '2026-01-18T15:10:00Z'
  },
  {
    id: 'demo-doc-12',
    family_member_id: 'demo-fam-4',
    title: 'University Bonafide Student Certificate',
    category: 'Educational Certificate',
    status: 'Not Uploaded',
    notes: 'Required for driving license application learner test exemption.',
    updated_at: '2026-02-10T16:30:00Z'
  }
];
