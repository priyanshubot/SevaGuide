const fs = require('fs');
const path = require('path');

const files = {
  'src/types/index.ts': `export interface DocumentRequirement {
  id: string;
  name: string;
  description: string;
  required: boolean;
  category: 'identity' | 'address' | 'photo' | 'existing';
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
}

export interface VerificationFieldCheck {
  fieldName: string;
  status: 'PASS' | 'WARNING' | 'ERROR';
  extractedValue?: string;
  message: string;
}

export interface VerificationResult {
  serviceId: string;
  overallStatus: 'PASS' | 'WARNING' | 'ERROR';
  totalDocuments: number;
  warningsCount: number;
  errorsCount: number;
  fieldChecks: VerificationFieldCheck[];
  extractedOcrData: Record<string, string>;
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
}`,

  'src/data/services.ts': `import { Service } from '../types';

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
];`,

  'src/data/applications.ts': `import { Application } from '../types';

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
];`,

  'src/data/verification.ts': `import { VerificationResult } from '../types';

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
};`,

  'src/data/offices.ts': `import { Office } from '../types';

export const OFFICES_DATA: Office[] = [
  {
    id: 'off-1',
    name: 'District Facilitation Centre',
    serviceIds: ['pan-correction', 'aadhaar-update'],
    address: 'Civic Centre, Sector 6, Bhilai, Chhattisgarh 490006',
    latitude: 21.1938,
    longitude: 81.3509,
    distanceKm: 2.4,
    phone: '+91 788 222 4100',
    hours: 'Mon - Fri: 9:30 AM - 5:00 PM',
    isOpen: true
  },
  {
    id: 'off-2',
    name: 'Regional Passport Seva Kendra (PSK)',
    serviceIds: ['passport-application'],
    address: 'VIP Road, Near Airport Circle, Raipur, Chhattisgarh 492015',
    latitude: 21.2379,
    longitude: 81.6337,
    distanceKm: 18.5,
    phone: '+91 1800 258 1800',
    hours: 'Mon - Sat: 9:00 AM - 4:00 PM',
    isOpen: true
  },
  {
    id: 'off-3',
    name: 'Aadhaar Seva Kendra (ASK)',
    serviceIds: ['aadhaar-update'],
    address: 'Main Road, Supela, Bhilai, Chhattisgarh 490023',
    latitude: 21.2012,
    longitude: 81.3341,
    distanceKm: 4.1,
    phone: '+91 1947',
    hours: 'Mon - Sun: 9:00 AM - 6:00 PM',
    isOpen: false
  }
];`,

  'src/services/ai.ts': `import { ChatMessage } from '../types';

export interface AIContext {
  activeServiceId?: string;
  activeServiceName?: string;
  currentStep?: string;
  verificationIssues?: string[];
}

export async function askSevaGuide(question: string, context?: AIContext): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const q = question.toLowerCase();

  if (q.includes('document') || q.includes('need') || q.includes('require')) {
    return \`For \${context?.activeServiceName || 'government services'}, you generally need: 1) Proof of Identity (POI), 2) Proof of Address (POA), and 3) A recent passport photograph. Always ensure names match exactly across all cards.\`;
  }

  if (q.includes('warning') || q.includes('address') || q.includes('mismatch')) {
    return \`If you see an address warning, verify if your recent utility bill has a different street layout than your Aadhaar card. You can submit an official Gazette notification or a self-declaration affidavit if required.\`;
  }

  if (q.includes('where') || q.includes('office') || q.includes('submit')) {
    return \`You can submit your documents online via official government portals, or visit the nearest facilitation office. Check our "Find Office" tab to locate nearest centers with direction assistance.\`;
  }

  return \`I am SevaGuide AI assistant. I can help guide you through document preparation, pre-submission checks, and locating official government service centers for \${context?.activeServiceName || 'your application'}.\`;
}`,

  'src/services/maps.ts': `import { Office } from '../types';

export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export function getDirectionsUrl(office: Office): string {
  const query = encodeURIComponent(\`\${office.name}, \${office.address}\`);
  return \`https://www.google.com/maps/search/?api=1&query=\${query}\`;
}

export function getMapEmbedUrl(office: Office): string {
  if (GOOGLE_MAPS_API_KEY) {
    return \`https://www.google.com/maps/embed/v1/place?key=\${GOOGLE_MAPS_API_KEY}&q=\${office.latitude},\${office.longitude}\`;
  }
  return \`https://www.openstreetmap.org/export/embed.html?bbox=\${office.longitude - 0.01}%2C\${office.latitude - 0.01}%2C\${office.longitude + 0.01}%2C\${office.latitude + 0.01}&layer=mapnik&marker=\${office.latitude}%2C\${office.longitude}\`;
}`,

  'src/components/Navbar.tsx': `import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, Bot, FileText, MapPin, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  onOpenAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAssistant }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-white hover:opacity-90">
            <div className="bg-emerald-600 p-1.5 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span>Seva<span className="text-emerald-400">Guide</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/services" className={\`hover:text-emerald-400 transition \${isActive('/services') ? 'text-emerald-400' : 'text-slate-300'}\`}>Services</Link>
            <Link to="/offices" className={\`hover:text-emerald-400 transition \${isActive('/offices') ? 'text-emerald-400' : 'text-slate-300'}\`}>Find Office</Link>
            <Link to="/applications" className={\`hover:text-emerald-400 transition \${isActive('/applications') ? 'text-emerald-400' : 'text-slate-300'}\`}>My Applications</Link>
            <button onClick={onOpenAssistant} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-200 hover:text-emerald-400 hover:border-emerald-500/50 transition text-xs font-semibold">
              <Bot className="w-4 h-4 text-emerald-400" /> Ask SevaGuide
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/services" className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition">Get Started</Link>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-slate-300 hover:text-white p-2">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 text-base"><FileText className="w-5 h-5 text-emerald-400" /> Services</Link>
          <Link to="/offices" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 text-base"><MapPin className="w-5 h-5 text-emerald-400" /> Find Office</Link>
          <Link to="/applications" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 text-base"><LayoutDashboard className="w-5 h-5 text-emerald-400" /> My Applications</Link>
          <button onClick={() => { setMobileMenuOpen(false); onOpenAssistant(); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800 text-emerald-400 text-base font-medium"><Bot className="w-5 h-5" /> Ask SevaGuide AI</button>
        </div>
      )}
    </nav>
  );
};`,

  'src/components/Footer.tsx': `import React from 'react';
import { Shield, AlertCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-sm py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-white text-lg">
            <Shield className="w-5 h-5 text-emerald-400" /> SevaGuide
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            A civic-tech guidance platform helping citizens understand service workflows, verify document consistency, and locate relevant regional government offices prior to physical submission.
          </p>
        </div>
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-300">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p><strong>Official Guidance Disclaimer:</strong> SevaGuide provides pre-submission verification and informational guidance based on available public guidelines. Always confirm current rules, official fees, and eligibility requirements directly with relevant authorized government authorities.</p>
        </div>
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} SevaGuide Civic-Tech Platform. Demo / Prototype Environment.</p>
        </div>
      </div>
    </footer>
  );
};`,

  'src/components/ServiceCard.tsx': `import React from 'react';
import { Link } from 'react-router-dom';
import { Service } from '../types';
import { FileText, ArrowRight, Clock, Banknote } from 'lucide-react';

export const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">{service.category}</span>
          <FileText className="w-5 h-5 text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">{service.name}</h3>
        <p className="text-sm text-slate-600 mb-6 line-clamp-2">{service.description}</p>
      </div>
      <div>
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-4 border-t border-slate-100 mb-6">
          <div className="flex items-center gap-1.5"><Banknote className="w-3.5 h-3.5 text-slate-400" /><span>Fee: <strong className="text-slate-700">{service.fee}</strong></span></div>
          <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /><span>Time: <strong className="text-slate-700">{service.processingTime}</strong></span></div>
        </div>
        <Link to={\`/services/\${service.id}\`} className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-2.5 rounded-xl transition">
          View Requirements <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};`,

  'src/components/ProcessSteps.tsx': `import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const ProcessSteps: React.FC<{ steps: string[]; currentStepIndex: number }> = ({ steps, currentStepIndex }) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          return (
            <div key={idx} className="relative z-10 flex flex-col items-center">
              <div className={\`w-9 h-9 rounded-full flex items-center justify-center border-2 font-bold text-xs transition-all \${
                isCompleted ? 'bg-emerald-600 border-emerald-600 text-white' : isCurrent ? 'bg-slate-900 border-slate-900 text-white ring-4 ring-slate-100' : 'bg-white border-slate-300 text-slate-400'
              }\`}>
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
              </div>
              <span className={\`text-xs mt-2 font-medium max-w-[80px] text-center hidden sm:block \${
                isCurrent ? 'text-slate-900 font-bold' : isCompleted ? 'text-emerald-700' : 'text-slate-400'
              }\`}>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};`,

  'src/components/DocumentRequirementCard.tsx': `import React from 'react';
import { DocumentRequirement } from '../types';
import { FileCheck, Upload, Check } from 'lucide-react';

export const DocumentRequirementCard: React.FC<{ doc: DocumentRequirement; uploadedFile?: File | null; onUpload?: (file: File) => void }> = ({ doc, uploadedFile, onUpload }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-100 rounded-xl text-slate-700"><FileCheck className="w-5 h-5" /></div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">{doc.name}</h4>
            <p className="text-xs text-slate-500">{doc.description}</p>
          </div>
        </div>
        <span className={\`text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider \${doc.required ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-600'}\`}>
          {doc.required ? 'Required' : 'Optional'}
        </span>
      </div>
      <div className={\`mt-3 border-2 border-dashed rounded-xl p-4 text-center transition \${uploadedFile ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 bg-slate-50'}\`}>
        {uploadedFile ? (
          <div className="flex items-center justify-between text-xs text-emerald-800 font-medium">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" />{uploadedFile.name}</span>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center justify-center gap-1">
            <Upload className="w-5 h-5 text-slate-400" />
            <span className="text-xs text-slate-600 font-medium">Click or drag file to upload</span>
            <input type="file" onChange={(e) => e.target.files?.[0] && onUpload?.(e.target.files[0])} className="hidden" />
          </label>
        )}
      </div>
    </div>
  );
};`,

  'src/components/OfficeMap.tsx': `import React from 'react';
import { Office } from '../types';
import { Navigation } from 'lucide-react';
import { getMapEmbedUrl, getDirectionsUrl } from '../services/maps';

export const OfficeMap: React.FC<{ office: Office }> = ({ office }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
        <div>
          <h4 className="font-bold text-sm">{office.name}</h4>
          <p className="text-xs text-slate-400">{office.distanceKm} km away</p>
        </div>
        <a href={getDirectionsUrl(office)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition">
          <Navigation className="w-3.5 h-3.5" /> Directions
        </a>
      </div>
      <div className="h-64 w-full bg-slate-100">
        <iframe title={office.name} src={getMapEmbedUrl(office)} className="w-full h-full border-0" loading="lazy" />
      </div>
    </div>
  );
};`,

  'src/components/AIAssistantDrawer.tsx': `import React, { useState } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { askSevaGuide, AIContext } from '../services/ai';
import { ChatMessage } from '../types';

export const AIAssistantDrawer: React.FC<{ isOpen: boolean; onClose: () => void; context?: AIContext }> = ({ isOpen, onClose, context }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: '1', sender: 'assistant', text: \`Hello! I'm SevaGuide AI. How can I help you today?\`, timestamp: 'Just now' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'user', text: query, timestamp: 'Just now' }]);
    if (!textToSend) setInput('');
    setLoading(true);
    try {
      const aiReply = await askSevaGuide(query, context);
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), sender: 'assistant', text: aiReply, timestamp: 'Just now' }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 border-l border-slate-200 flex flex-col">
      <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
        <div className="flex items-center gap-2"><Bot className="w-5 h-5 text-emerald-400" /><h3 className="font-bold text-sm">Ask SevaGuide AI</h3></div>
        <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
        {messages.map((m) => (
          <div key={m.id} className={\`flex \${m.sender === 'user' ? 'justify-end' : 'justify-start'}\`}>
            <div className={\`max-w-[85%] rounded-2xl p-3 \${m.sender === 'user' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-800'}\`}>{m.text}</div>
          </div>
        ))}
        {loading && <div className="text-slate-500 text-xs"><Sparkles className="w-3.5 h-3.5 text-emerald-500 inline mr-1" /> Checking...</div>}
      </div>
      <div className="p-3 border-t bg-white flex gap-2">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask a question..." className="flex-1 bg-slate-100 border rounded-xl px-3 py-2 text-xs" />
        <button onClick={() => handleSend()} className="bg-emerald-600 text-white p-2 rounded-xl"><Send className="w-4 h-4" /></button>
      </div>
    </div>
  );
};`,

  'src/components/UIFeedback.tsx': `import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500 text-sm">
    <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
    <p>{message}</p>
  </div>
);

export const ErrorState: React.FC<{ title?: string; message?: string }> = ({ title = 'Something went wrong', message = 'Failed to load details.' }) => (
  <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-900 text-center my-6 max-w-md mx-auto space-y-2">
    <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
    <h4 className="font-bold">{title}</h4>
    <p className="text-xs text-red-700">{message}</p>
  </div>
);`,

  'src/layouts/MainLayout.tsx': `import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AIAssistantDrawer } from '../components/AIAssistantDrawer';

export const MainLayout: React.FC = () => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar onOpenAssistant={() => setIsAssistantOpen(true)} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8"><Outlet /></main>
      <Footer />
      <AIAssistantDrawer isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />
    </div>
  );
};`,

  'src/pages/Home.tsx': `import React from 'react';
import { Link } from 'react-router-dom';
import { SERVICES_DATA } from '../data/services';
import { ServiceCard } from '../components/ServiceCard';
import { ShieldCheck, Search, FileSpreadsheet, MapPin } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="space-y-16">
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
        <div className="max-w-2xl space-y-6">
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">Citizen Guidance Platform</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Government services, without the confusion.</h1>
          <p className="text-slate-300 text-base">Know what you need, verify your documents, find the right office, and track your process.</p>
          <div className="flex gap-4">
            <Link to="/services" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3 rounded-xl transition">Explore Services</Link>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border space-y-2"><Search className="w-5 h-5 text-emerald-600" /><h3 className="font-bold">Know Requirements</h3><p className="text-xs text-slate-600">Understand requirements before visiting.</p></div>
        <div className="bg-white p-6 rounded-2xl border space-y-2"><ShieldCheck className="w-5 h-5 text-emerald-600" /><h3 className="font-bold">Verify Documents</h3><p className="text-xs text-slate-600">Detect common document mismatches early.</p></div>
        <div className="bg-white p-6 rounded-2xl border space-y-2"><MapPin className="w-5 h-5 text-emerald-600" /><h3 className="font-bold">Find Offices</h3><p className="text-xs text-slate-600">Locate relevant government service centers.</p></div>
        <div className="bg-white p-6 rounded-2xl border space-y-2"><FileSpreadsheet className="w-5 h-5 text-emerald-600" /><h3 className="font-bold">Track Status</h3><p className="text-xs text-slate-600">Know what step comes next clearly.</p></div>
      </section>
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Popular Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{SERVICES_DATA.map((s) => <ServiceCard key={s.id} service={s} />)}</div>
      </section>
    </div>
  );
};`,

  'src/pages/Services.tsx': `import React, { useState } from 'react';
import { SERVICES_DATA } from '../data/services';
import { ServiceCard } from '../components/ServiceCard';
import { Search } from 'lucide-react';

export const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const filtered = SERVICES_DATA.filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Government Services Directory</h1>
        <p className="text-slate-600 text-sm mt-1">Choose a service to see requirements and guidance.</p>
      </div>
      <div className="relative max-w-md">
        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input type="text" placeholder="Search services..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white border rounded-xl pl-10 pr-4 py-2.5 text-sm" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{filtered.map((service) => <ServiceCard key={service.id} service={service} />)}</div>
    </div>
  );
};`,

  'src/pages/ServiceDetails.tsx': `import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SERVICES_DATA } from '../data/services';
import { ProcessSteps } from '../components/ProcessSteps';
import { DocumentRequirementCard } from '../components/DocumentRequirementCard';
import { ShieldCheck, MapPin } from 'lucide-react';

export const ServiceDetails: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = SERVICES_DATA.find((s) => s.id === serviceId);

  if (!service) return <div>Service not found</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">{service.name}</h1>
        <p className="text-slate-600 text-sm mt-1">{service.description}</p>
      </div>
      <ProcessSteps steps={service.steps} currentStepIndex={0} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-3">
          <h3 className="font-bold text-lg">Required Documents</h3>
          {service.requiredDocuments.map((doc) => <DocumentRequirementCard key={doc.id} doc={doc} />)}
        </div>
        <div className="bg-white p-6 rounded-2xl border space-y-4 h-fit">
          <h4 className="font-bold">Service Details</h4>
          <p className="text-xs">Fee: <strong>{service.fee}</strong></p>
          <p className="text-xs">Time: <strong>{service.processingTime}</strong></p>
          <Link to={\`/verify/\${service.id}\`} className="w-full flex justify-center items-center gap-2 bg-emerald-600 text-white font-semibold py-3 rounded-xl"><ShieldCheck className="w-4 h-4" /> Verify Documents</Link>
          <Link to={\`/offices/\${service.id}\`} className="w-full flex justify-center items-center gap-2 bg-slate-100 text-slate-800 font-semibold py-2.5 rounded-xl"><MapPin className="w-4 h-4" /> Find Office</Link>
        </div>
      </div>
    </div>
  );
};`,

  'src/pages/VerifyDocuments.tsx': `import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SERVICES_DATA } from '../data/services';
import { MOCK_VERIFICATION_RESULTS } from '../data/verification';
import { ProcessSteps } from '../components/ProcessSteps';
import { DocumentRequirementCard } from '../components/DocumentRequirementCard';
import { ShieldCheck, AlertTriangle, CheckCircle } from 'lucide-react';

export const VerifyDocuments: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = SERVICES_DATA.find((s) => s.id === serviceId);
  const [verifying, setVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  if (!service) return null;
  const mockResult = MOCK_VERIFICATION_RESULTS[serviceId || ''] || MOCK_VERIFICATION_RESULTS['pan-correction'];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold">Pre-Submission Document Check</h1>
      <ProcessSteps steps={service.steps} currentStepIndex={1} />
      {!isVerified ? (
        <div className="space-y-6">
          {service.requiredDocuments.map((doc) => <DocumentRequirementCard key={doc.id} doc={doc} />)}
          <button onClick={() => { setVerifying(true); setTimeout(() => { setVerifying(false); setIsVerified(true); }, 1200); }} className="w-full bg-emerald-600 text-white font-semibold py-3.5 rounded-xl">
            {verifying ? 'Scanning Mismatches...' : 'Verify Uploaded Documents'}
          </button>
        </div>
      ) : (
        <div className="space-y-6 bg-white p-6 rounded-2xl border">
          <h3 className="font-bold flex items-center gap-2"><AlertTriangle className="text-amber-500" /> Verification Result: {mockResult.overallStatus}</h3>
          {mockResult.fieldChecks.map((check, idx) => (
            <div key={idx} className="p-3 bg-slate-50 border rounded-xl text-xs flex items-center gap-2">
              {check.status === 'PASS' ? <CheckCircle className="text-emerald-600 w-4 h-4" /> : <AlertTriangle className="text-amber-500 w-4 h-4" />}
              <span><strong>{check.fieldName}:</strong> {check.message}</span>
            </div>
          ))}
          <Link to="/applications" className="inline-block bg-slate-900 text-white font-semibold px-5 py-2.5 rounded-xl text-xs">View Applications</Link>
        </div>
      )}
    </div>
  );
};`,

  'src/pages/Applications.tsx': `import React from 'react';
import { Link } from 'react-router-dom';
import { INITIAL_APPLICATIONS } from '../data/applications';
import { ProcessSteps } from '../components/ProcessSteps';
import { SERVICES_DATA } from '../data/services';

export const Applications: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold text-slate-900">My Applications</h1>
      <div className="grid gap-6">
        {INITIAL_APPLICATIONS.map((app) => {
          const service = SERVICES_DATA.find((s) => s.id === app.serviceId);
          return (
            <div key={app.id} className="bg-white p-6 rounded-2xl border space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-lg font-bold">{app.serviceName}</h3>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border">{app.status}</span>
              </div>
              {service && <ProcessSteps steps={service.steps} currentStepIndex={app.currentStepIndex} />}
              <div className="flex justify-end pt-2">
                <Link to={\`/offices/\${app.serviceId}\`} className="text-emerald-700 font-bold text-xs hover:underline">Find Office →</Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};`,

  'src/pages/OfficeLocator.tsx': `import React, { useState } from 'react';
import { OFFICES_DATA } from '../data/offices';
import { OfficeMap } from '../components/OfficeMap';

export const OfficeLocator: React.FC = () => {
  const [selectedOffice, setSelectedOffice] = useState(OFFICES_DATA[0]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold">Find Government Office</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-3">
          {OFFICES_DATA.map((office) => (
            <div key={office.id} onClick={() => setSelectedOffice(office)} className={\`p-4 rounded-2xl border cursor-pointer \${selectedOffice.id === office.id ? 'border-slate-900 bg-white ring-2 ring-slate-900/10' : 'bg-white'}\`}>
              <h4 className="font-bold text-sm">{office.name}</h4>
              <p className="text-xs text-slate-500 mt-1">{office.address}</p>
            </div>
          ))}
        </div>
        <div className="md:col-span-2"><OfficeMap office={selectedOffice} /></div>
      </div>
    </div>
  );
};`,

  'src/App.tsx': `import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { ServiceDetails } from './pages/ServiceDetails';
import { VerifyDocuments } from './pages/VerifyDocuments';
import { Applications } from './pages/Applications';
import { OfficeLocator } from './pages/OfficeLocator';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:serviceId" element={<ServiceDetails />} />
          <Route path="verify/:serviceId" element={<VerifyDocuments />} />
          <Route path="applications" element={<Applications />} />
          <Route path="offices" element={<OfficeLocator />} />
          <Route path="offices/:serviceId" element={<OfficeLocator />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;`
};

console.log('🚀 Creating SevaGuide file tree...');

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim());
  console.log(`  ✓ Created ${filePath}`);
});

console.log('\n✅ All 22 files created successfully!');
