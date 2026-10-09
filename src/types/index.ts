export interface DocumentRequirement {
  id: string;
  name: string;
  description: string;
  required: boolean;
  category: string;
  isConditional?: boolean;
  conditionNote?: string;
  acceptedExamples?: string[];
}

export interface ServiceStepDetail {
  step: number;
  title: string;
  description: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  fee: string;
  processingTime: string;
  requiredDocuments: DocumentRequirement[];
  steps: string[];
  stepDetails?: ServiceStepDetail[];
  eligibilitySummary?: string[];
  conditionalNotice?: string;
  officialPortalUrl?: string;
  officialPortalName?: string;
  officeAssistanceInfo?: string;
  importantNotes?: string[];
  disclaimer?: string;
  hasConditionalDocs?: boolean;
  isPopular?: boolean;
  shortDescription?: string;
  conciseFee?: string;
  conciseProcessingTime?: string;
}

export interface VerificationFieldCheck {
  fieldName: string;
  status: 'PASS' | 'WARNING' | 'ERROR' | 'INFO';
  extractedValue?: string;
  message: string;
}

export interface VerificationResult {
  serviceId: string;
  overallStatus: 'PASS' | 'WARNING' | 'ERROR' | 'NEEDS_REVIEW';
  totalDocuments: number;
  warningsCount: number;
  errorsCount: number;
  fieldChecks: VerificationFieldCheck[];
  extractedOcrData: Record<string, string>;
  isOcrProcessed?: boolean;
  ocrConfidence?: number;
  disclaimer?: string;
}

export type ApplicationStatus = 'In Progress' | 'Action Required' | 'Completed' | 'Pending Submission';

export interface Application {
  id: string;
  serviceId: string;
  serviceName: string;
  applicantName: string;
  currentStepIndex: number;
  status: ApplicationStatus;
  lastUpdated: string;
  verificationSummary?: {
    warnings: number;
    errors: number;
  };
}

export interface Office {
  id: string;
  name: string;
  serviceIds: string[];
  address: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  phone: string;
  hours: string;
  isOpen: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export type DocumentCategoryType =
  | 'Aadhaar Card'
  | 'PAN Card'
  | 'Driving Licence'
  | 'Voter ID'
  | 'Income Certificate'
  | 'Domicile Certificate'
  | 'Passport'
  | 'Proof of Address'
  | 'Proof of Identity'
  | 'Proof of Date of Birth'
  | 'Photograph'
  | 'Other';

export interface UserDocument {
  id: string;
  user_id: string;
  document_type: DocumentCategoryType | string;
  file_name: string;
  storage_path: string;
  mime_type?: string;
  file_size?: number;
  verification_status: 'pending' | 'verified' | 'warning' | 'error';
  uploaded_at: string;
  updated_at?: string;
  file_url?: string;
  ocr_data?: Record<string, any>;
}