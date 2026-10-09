import { Application } from '../types';

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'APP-PAN-2026-881',
    serviceId: 'pan-correction',
    serviceName: 'PAN Correction',
    applicantName: 'Priyanshu Pandey',
    currentStepIndex: 2,
    status: 'Action Required',
    lastUpdated: 'Yesterday, 4:15 PM',
    verificationSummary: { warnings: 1, errors: 0 }
  },
  {
    id: 'APP-ADH-2026-104',
    serviceId: 'aadhaar-update',
    serviceName: 'Aadhaar Update',
    applicantName: 'Priyanshu Pandey',
    currentStepIndex: 4,
    status: 'Completed',
    lastUpdated: '01 Oct 2026'
  },
  {
    id: 'APP-PSP-2026-309',
    serviceId: 'passport-application',
    serviceName: 'Passport Application',
    applicantName: 'Priyanshu Pandey',
    currentStepIndex: 1,
    status: 'In Progress',
    lastUpdated: 'Today, 10:30 AM'
  }
];