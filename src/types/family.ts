export type FamilyRelationship =
  | 'Father'
  | 'Mother'
  | 'Spouse'
  | 'Son'
  | 'Daughter'
  | 'Brother'
  | 'Sister'
  | 'Grandfather'
  | 'Grandmother'
  | 'Guardian'
  | 'Other';

export type FamilyDocumentCategory =
  | 'Identity Proof'
  | 'Address Proof'
  | 'Birth Certificate'
  | 'Educational Certificate'
  | 'Income Certificate'
  | 'Other Documents';

export type FamilyDocumentStatus =
  | 'Not Uploaded'
  | 'Pending Review'
  | 'Verified'
  | 'Needs Attention';

export interface FamilyMember {
  id: string;
  user_id: string;
  management_id: string; // e.g. FAM-2026-001
  full_name: string;
  relationship: FamilyRelationship | string;
  date_of_birth?: string;
  email?: string;
  phone?: string;
  notes?: string;
  is_demo?: boolean;
  created_at: string;
  updated_at: string;
}

export interface FamilyDocument {
  id: string;
  user_id: string;
  family_member_id: string;
  title: string;
  category: FamilyDocumentCategory;
  status: FamilyDocumentStatus;
  file_name?: string;
  storage_path?: string;
  file_size?: number;
  notes?: string;
  uploaded_at?: string;
  updated_at: string;
}

export type CompletionStatus = 'Complete' | 'In Progress' | 'Needs Attention' | 'Empty';

export interface FamilyMemberWithDocs extends FamilyMember {
  documents: FamilyDocument[];
  completion_status: CompletionStatus;
}

export interface FamilySummaryStats {
  totalMembers: number;
  totalDocuments: number;
  verifiedDocuments: number;
  attentionDocuments: number;
}
