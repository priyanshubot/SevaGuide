import { Service } from '../types';

export const SERVICES_DATA: Service[] = [
  // ==========================================
  // A. AADHAAR SERVICES
  // ==========================================
  {
    id: 'aadhaar-enrolment',
    name: 'New Aadhaar Enrolment',
    category: 'Identity',
    description: 'Fresh 12-digit Aadhaar enrolment for Indian residents with biometric and demographic capture.',
    fee: 'Free of charge',
    processingTime: 'Typically 15 - 30 days',
    shortDescription: 'Fresh Aadhaar enrolment for residents with biometric and demographic capture.',
    conciseFee: 'Free',
    conciseProcessingTime: '15 - 30 days',
    isPopular: true,
    officialPortalUrl: 'https://uidai.gov.in',
    officialPortalName: 'UIDAI Official Portal',
    officeAssistanceInfo: 'Authorised Aadhaar Enrolment Centres, Aadhaar Seva Kendras (ASK), designated post offices and bank branches.',
    conditionalNotice: 'Document requirements depend on applicant age and whether enrolling independently or via the Head of Family (HoF) route. A single accepted document (e.g. Passport) may satisfy multiple proof categories.',
    hasConditionalDocs: true,
    eligibilitySummary: [
      'Any individual residing in India (resident for 182+ days in the preceding 12 months) who does not already possess an Aadhaar number.',
      'Open to all age groups: newborns, children, adults, and senior citizens.',
      'Children below 5 years do not require iris or fingerprint capture; enrolment requires a linked parent/guardian Aadhaar and relationship proof.',
      'Mandatory biometric updates apply for children once they attain 5 years and 15 years of age.'
    ],
    requiredDocuments: [
      {
        id: 'doc-enrol-poi',
        name: 'Proof of Identity (PoI)',
        category: 'identity',
        required: true,
        description: 'Document bearing the applicant’s name and photograph to establish legal identity.',
        acceptedExamples: ['Voter ID', 'Indian Passport', 'PAN Card', 'Ration Card with photo', 'Driving Licence', 'Government Photo Identity Card']
      },
      {
        id: 'doc-enrol-poa',
        name: 'Proof of Address (PoA)',
        category: 'address',
        required: true,
        description: 'Document establishing the applicant’s current residential address in India.',
        acceptedExamples: ['Indian Passport', 'PDS Ration Card', 'Electricity Bill (within 3 months)', 'Water/Telephone Landline Bill', 'Bank Passbook with photo & address']
      },
      {
        id: 'doc-enrol-dob',
        name: 'Proof of Date of Birth (DoB)',
        category: 'age',
        required: false,
        isConditional: true,
        conditionNote: 'Required if you want your date of birth recorded as "Verified". If not provided, DoB will be recorded as "Declared" based on applicant statement.',
        description: 'Official birth record to substantiate exact calendar date of birth.',
        acceptedExamples: ['Birth Certificate issued by Registrar/Municipal Authority', 'SSLC/10th Marksheet', 'Indian Passport', 'PAN Card']
      },
      {
        id: 'doc-enrol-por',
        name: 'Proof of Relationship (PoR)',
        category: 'relationship',
        required: false,
        isConditional: true,
        conditionNote: 'Required only when enrolling children or using the Head of Family (HoF) route where the applicant lacks individual PoI/PoA documents.',
        description: 'Official document linking the applicant to the Head of Family or parent.',
        acceptedExamples: ['PDS Ration Card with family roster', 'Birth Certificate showing parent names', 'State Family Entitlement Card', 'Marriage Certificate']
      },
      {
        id: 'doc-enrol-form',
        name: 'Aadhaar Enrolment Form',
        category: 'form',
        required: true,
        description: 'Standard UIDAI enrolment application form filled with applicant demographic details.',
        acceptedExamples: ['Form available free of charge at any Aadhaar Seva Kendra or downloaded from uidai.gov.in']
      }
    ],
    steps: [
      'Check valid document list on UIDAI portal',
      'Locate an authorised Aadhaar Enrolment Centre or ASK',
      'Visit centre with original documents and filled form',
      'Verify demographic details on the operator screen',
      'Biometric capture (photograph, 10 fingerprints, iris scans)',
      'Collect acknowledgement slip containing Enrolment ID (EID)',
      'Track status online on uidai.gov.in'
    ],
    stepDetails: [
      { step: 1, title: 'Check Documents', description: 'Confirm that your physical papers appear on UIDAI’s latest valid documents list.' },
      { step: 2, title: 'Locate Centre', description: 'Find an authorised centre via Bhuvan Aadhaar or the UIDAI appointment portal.' },
      { step: 3, title: 'Visit & Submit', description: 'Present original documents to the enrolment operator. Originals are scanned and returned immediately.' },
      { step: 4, title: 'Verify On-Screen', description: 'Carefully cross-check your name spelling, date of birth, gender, and residential address before the operator submits.' },
      { step: 5, title: 'Biometrics', description: 'Provide facial photograph, 10 fingerprints, and dual iris scan. (Biometrics exempted for children under 5).' },
      { step: 6, title: 'EID Receipt', description: 'Receive an acknowledgement slip containing your 28-digit Enrolment ID (EID) timestamp.' },
      { step: 7, title: 'Track & Download', description: 'Check enrolment status online. Once generated, download your e-Aadhaar from myaadhaar.uidai.gov.in.' }
    ],
    importantNotes: [
      'New Aadhaar enrolment is completely free of charge. No centre is authorised to charge fees for fresh enrolment.',
      'Always bring physical original documents. Laminated cards or photocopies alone are not accepted for biometric verification.',
      'Mobile number and email ID are optional during enrolment but strongly recommended for OTP self-service.'
    ],
    disclaimer: 'This guide is prepared based on UIDAI offline enrolment guidelines. Final document acceptance is determined by UIDAI rules at the enrolment centre.'
  },

  {
    id: 'aadhaar-update',
    name: 'Aadhaar Update & Correction',
    category: 'Identity',
    description: 'Update personal details, biometric info, mobile number, or residential address in your existing Aadhaar record.',
    fee: '₹50 (Demographic) / ₹100 (Biometric)',
    processingTime: '5 - 15 working days',
    shortDescription: 'Update details, biometrics, mobile number, or address in your Aadhaar.',
    conciseFee: '₹50 - ₹100',
    conciseProcessingTime: '5 - 15 days',
    isPopular: true,
    officialPortalUrl: 'https://myaadhaar.uidai.gov.in',
    officialPortalName: 'myAadhaar Portal',
    officeAssistanceInfo: 'Online via myAadhaar (if mobile is linked) or at any Aadhaar Seva Kendra / Bank / Post Office.',
    conditionalNotice: 'Address updates can be performed online with mobile OTP. Name, DoB, and Biometric updates require in-person verification at an Aadhaar Seva Kendra.',
    hasConditionalDocs: true,
    eligibilitySummary: [
      'Existing Aadhaar number holders needing changes in demographic details (name, address, DoB, gender) or biometrics (photo, fingerprints, iris).',
      'Name changes: Allowed up to 2 times in lifetime.',
      'Date of Birth update: Allowed only once in lifetime with valid birth proof.',
      'Gender update: Allowed only once in lifetime.'
    ],
    requiredDocuments: [
      {
        id: 'doc-poi',
        name: 'Proof of Identity (PoI)',
        category: 'identity',
        required: true,
        description: 'Document bearing the applicant’s name and photograph (mandatory for Name or DoB corrections).',
        acceptedExamples: ['PAN Card', 'Indian Passport', 'Voter ID', 'Driving Licence', 'Government Photo ID']
      },
      {
        id: 'doc-poa',
        name: 'Proof of Address (PoA)',
        category: 'address',
        required: true,
        description: 'Document establishing current address (mandatory if updating residential address).',
        acceptedExamples: ['Electricity Bill (not older than 3 months)', 'Bank Passbook with photo & address', 'PDS Ration Card', 'Rent Agreement', 'Water/Gas Connection Bill']
      },
      {
        id: 'doc-dob',
        name: 'Proof of Date of Birth (DoB)',
        category: 'age',
        required: false,
        isConditional: true,
        conditionNote: 'Required only if updating date of birth. Must show full DD/MM/YYYY.',
        description: 'Official document proving date of birth.',
        acceptedExamples: ['Birth Certificate issued by Municipal Authority', 'SSLC/10th Marksheet', 'Indian Passport', 'PAN Card']
      }
    ],
    steps: [
      'Prepare Documents',
      'Verify Details',
      'Book Appointment / Online Request',
      'Biometric/Doc Submission',
      'Track Status'
    ],
    stepDetails: [
      { step: 1, title: 'Prepare Documents', description: 'Select valid supporting documents matching your requested update.' },
      { step: 2, title: 'Verify Details', description: 'Log in to myAadhaar with mobile OTP or visit an enrolment centre.' },
      { step: 3, title: 'Submit Request', description: 'Fill the update form and upload documents or provide them to the operator.' },
      { step: 4, title: 'Pay Fee', description: 'Pay ₹50 for demographic or ₹100 for biometric updates.' },
      { step: 5, title: 'Track with URN', description: 'Use your Update Request Number (URN) to track validation progress.' }
    ],
    importantNotes: [
      'Ensure the name and address spelling match exactly between the supporting document and the requested update.',
      'Mandatory biometric updates for children at age 5 and age 15 are free of charge.'
    ],
    disclaimer: 'Guidance based on UIDAI update norms. UIDAI verification protocols govern final approval.'
  },

  // ==========================================
  // B. INDIAN PASSPORT
  // ==========================================
  {
    id: 'passport-application',
    name: 'Fresh Indian Passport Application',
    category: 'Travel & Immigration',
    description: 'Apply for a fresh ordinary Indian passport for adult citizen identification and travel.',
    fee: '₹1,500 (Normal 36 pages) / ₹2,000 (Normal 60 pages)',
    processingTime: '15 - 30 working days (Normal)',
    shortDescription: 'Apply for fresh 36 or 60-page Indian passport with appointment guidance.',
    conciseFee: '₹1,500 - ₹2,000',
    conciseProcessingTime: '15 - 30 days',
    isPopular: true,
    officialPortalUrl: 'https://www.passportindia.gov.in',
    officialPortalName: 'Passport Seva Portal',
    officeAssistanceInfo: 'Passport Seva Kendra (PSK) or Post Office Passport Seva Kendra (POPSK) under your Regional Passport Office (RPO).',
    conditionalNotice: 'Exact mandatory documents depend on applicant category (e.g. minor, government servant, senior citizen) and Non-ECR qualification. Check using the official Passport Seva Document Advisor before attending.',
    hasConditionalDocs: true,
    eligibilitySummary: [
      'Indian citizens by birth or naturalisation residing in India.',
      'Applying for an ordinary international passport (36 or 60 pages) for the first time.',
      'Must provide proof of present residential address and proof of date of birth.',
      'Applicant must disclose full address history for the preceding 12 months.'
    ],
    requiredDocuments: [
      {
        id: 'doc-pass-address',
        name: 'Proof of Present Address',
        category: 'address',
        required: true,
        description: 'Document confirming your current residential address. Must be accepted under the current Passport Seva list.',
        acceptedExamples: ['Aadhaar Card', 'Voter ID', 'Electricity Bill / Water Bill', 'Bank Photo Passbook (scheduled public/private bank)', 'Registered Rent Agreement', 'Gas Connection Bill']
      },
      {
        id: 'doc-pass-dob',
        name: 'Proof of Date of Birth (DoB)',
        category: 'age',
        required: true,
        description: 'Document confirming date of birth. Birth Certificate is preferred for all applicants born after 26/01/1989.',
        acceptedExamples: ['Birth Certificate issued by Registrar of Births & Deaths', 'School Leaving Certificate / Transfer Certificate (TC)', 'PAN Card', 'Aadhaar Card', 'Matriculation Certificate']
      },
      {
        id: 'doc-pass-nonecr',
        name: 'Educational Certificate (for Non-ECR)',
        category: 'educational',
        required: false,
        isConditional: true,
        conditionNote: 'Required if you wish to obtain Non-ECR (Emigration Check Not Required) status. Not mandatory if applying under ECR category.',
        description: 'Educational qualification proof to qualify for Non-ECR endorsement.',
        acceptedExamples: ['Matriculation / 10th Standard Pass Certificate', 'Higher Secondary / 12th Certificate', 'Graduation Degree or above']
      },
      {
        id: 'doc-pass-receipt',
        name: 'Appointment Confirmation / Application Receipt',
        category: 'form',
        required: true,
        description: 'Printed appointment confirmation slip containing Application Reference Number (ARN) and batch schedule.',
        acceptedExamples: ['Generated online from passportindia.gov.in after appointment booking and payment']
      },
      {
        id: 'doc-pass-copies',
        name: 'Originals and Self-Attested Photocopies',
        category: 'existing',
        required: true,
        description: 'Physical original copies of all submitted documents plus one set of clear self-attested photocopies.',
        acceptedExamples: ['Original cards/certificates for physical inspection by verifying officers at PSK']
      }
    ],
    steps: [
      'Register and apply online on Passport Seva',
      'Pay fee and book appointment slot at PSK/POPSK',
      'Organise originals and self-attested photocopies',
      'Attend appointment on time for document verification',
      'Official verification, photo and biometric capture',
      'Police verification at local police station',
      'Track status online and receive passport by Speed Post'
    ],
    stepDetails: [
      { step: 1, title: 'Register Online', description: 'Create an account on passportindia.gov.in, select your RPO, and complete the fresh passport application form.' },
      { step: 2, title: 'Pay & Schedule', description: 'Pay the applicable fee online and select your preferred PSK/POPSK appointment slot.' },
      { step: 3, title: 'Prepare Copies', description: 'Use the official Document Advisor and organise original records plus self-attested copies.' },
      { step: 4, title: 'Visit PSK/POPSK', description: 'Arrive 15 minutes before batch time with application receipt and original documents.' },
      { step: 5, title: 'Biometrics & Counter Check', description: 'Move through Counters A (photo/biometrics), B (document verification), and C (granting officer).' },
      { step: 6, title: 'Police Verification', description: 'Local police officer visits your address or calls you to confirm residential tenure.' },
      { step: 7, title: 'Dispatch', description: 'Track dispatch online. The passport is delivered directly to your doorstep by India Post Speed Post.' }
    ],
    importantNotes: [
      'Disclose all addresses where you have resided in the last one calendar year to prevent delays during police verification.',
      'Ensure spelling of name, father’s name, and date of birth are identical across all submitted documents.',
      'Tatkaal scheme requires additional annexures and higher fees; check the official Tatkaal advisor if urgent.'
    ],
    disclaimer: 'Based on the official Ministry of External Affairs Passport Seva guide. Official rules at passportindia.gov.in govern all granting decisions.'
  },

  // ==========================================
  // C. CHHATTISGARH DOMICILE CERTIFICATE
  // ==========================================
  {
    id: 'cg-domicile-certificate',
    name: 'Chhattisgarh Domicile Certificate (निवास प्रमाण पत्र)',
    category: 'Certificates',
    description: 'Establish permanent residence in Chhattisgarh for educational admissions, state recruitment, and civic benefits.',
    fee: '₹30 (Official Sewa Setu portal rate)',
    processingTime: '15 working days (Statutory service timeline)',
    isPopular: true,
    officialPortalUrl: 'https://test-ed.cgstate.gov.in/home?lang=en',
    officialPortalName: 'Chhattisgarh Sewa Setu / e-District',
    officeAssistanceInfo: 'Lok Seva Kendra (LSK), Sewa Setu Kendra, or Tehsil Revenue Office. Helpline: 0771-2992035.',
    conditionalNotice: 'The state portal lists multiple evidence examples for stay and education; not every example must be submitted simultaneously. Choose records matching your situation.',
    hasConditionalDocs: true,
    eligibilitySummary: [
      'Applicant must establish a qualifying connection or residence in Chhattisgarh using official revenue/education records.',
      'Sewa Setu service portal lists proof of at least 15 years’ stay in Chhattisgarh as a primary evidence category.',
      'Alternatively, applicants who have completed continuous education in Chhattisgarh (Class 5, 8, 10, 12, or 3 years continuous study) qualify under state rules.',
      'Minors can apply based on parents’ or legal guardians’ established residence or government service records.'
    ],
    requiredDocuments: [
      {
        id: 'doc-cg-dom-affidavit',
        name: 'Sworn Affidavit (शपथ पत्र)',
        category: 'form',
        required: true,
        description: 'Mandatory sworn affidavit affirming continuous residential tenure in Chhattisgarh.',
        acceptedExamples: ['Standard notary / executive magistrate attested affidavit format available on Sewa Setu or through Lok Seva Kendra']
      },
      {
        id: 'doc-cg-dom-photo',
        name: 'Recent Passport Photograph',
        category: 'photo',
        required: true,
        description: 'Clear, recent passport-size photograph of the applicant.',
        acceptedExamples: ['Recent color photograph on white or light background']
      },
      {
        id: 'doc-cg-dom-stay',
        name: 'Proof of at least 15 Years’ Residence in CG',
        category: 'address',
        required: true,
        description: 'Records demonstrating at least 15 years continuous stay in Chhattisgarh.',
        acceptedExamples: ['Birth Certificate', 'Voter ID Card', 'Ration Card', 'Electricity Bills across years', 'Land/House registry or Rin Pustika', 'Parent’s government service book or employer certificate']
      },
      {
        id: 'doc-cg-dom-edu',
        name: 'Educational Certificates / Continuous Study',
        category: 'educational',
        required: false,
        isConditional: true,
        conditionNote: 'Required when qualifying via educational route. Examples include Class 5, 8, 10, or 12 marksheets, or school certificate showing 3 years continuous study in Chhattisgarh.',
        description: 'Academic certificates from recognized educational institutions in Chhattisgarh.',
        acceptedExamples: ['Class 5 / Class 8 / Class 10 / Class 12 Marks Sheet', 'School Continuous Study Certificate (3+ years)', 'Postgraduate / Technical Degree certificate']
      },
      {
        id: 'doc-cg-dom-rep',
        name: 'Certificate from Ward Member / Sarpanch / MLA',
        category: 'certificate',
        required: false,
        isConditional: true,
        conditionNote: 'Optional supporting evidence where utility bills or land records are unavailable.',
        description: 'Residential verification certificate issued by local elected representative.',
        acceptedExamples: ['Certificate signed by Ward Councillor (Parshad), Gram Panchayat Sarpanch, or local MLA/MP']
      }
    ],
    steps: [
      'Open Chhattisgarh Sewa Setu / e-District portal',
      'Select "Domicile Certificate" under Revenue Services',
      'Register or log in as a citizen or visit Lok Seva Kendra',
      'Fill personal details, address, and residence history',
      'Upload affidavit, photo, residence proof, and education records',
      'Pay ₹30 fee and save acknowledgement receipt',
      'Revenue officer inquiry and digital certificate download'
    ],
    stepDetails: [
      { step: 1, title: 'Portal Access', description: 'Navigate to Sewa Setu (test-ed.cgstate.gov.in) and locate Domicile Certificate under Revenue services.' },
      { step: 2, title: 'Login / Register', description: 'Log in with citizen mobile credentials or apply through the nearest Lok Seva Kendra operator.' },
      { step: 3, title: 'Fill Form', description: 'Enter applicant details, parental names, caste/category, and historical residence duration in Chhattisgarh.' },
      { step: 4, title: 'Upload Proofs', description: 'Upload scanned copies of affidavit, photo, 15-year stay evidence, and educational certificates.' },
      { step: 5, title: 'Fee Payment', description: 'Pay ₹30 via online payment gateway or at the Lok Seva Kendra counter.' },
      { step: 6, title: 'Verification', description: 'Application routed to Patwari and Revenue Inspector (RI) for field inquiry and Sub-Divisional Officer (SDO) approval.' },
      { step: 7, title: 'Download Certificate', description: 'Download digitally signed Domicile Certificate with QR verification from Sewa Setu.' }
    ],
    importantNotes: [
      'Names, dates of birth, and addresses must be consistent across all submitted records. Explain any spelling differences with an affidavit.',
      'The 15-day limit is the state statutory timeline; actual processing may vary depending on field verification.',
      'Helpline: 0771-2992035; Email: edistrict.helpline@cgchips.in.'
    ],
    disclaimer: 'Summarised from official Chhattisgarh Sewa Setu service guidelines. The competent revenue authority makes final determinations.'
  },

  // ==========================================
  // D. CHHATTISGARH CASTE CERTIFICATES
  // ==========================================
  {
    id: 'cg-caste-scst',
    name: 'Chhattisgarh Caste Certificate (SC/ST - अनुसूचित जाति / जनजाति)',
    category: 'Certificates',
    description: 'Permanent caste certificate for recognized Scheduled Castes and Scheduled Tribes in Chhattisgarh.',
    fee: '₹30 (Official portal rate)',
    processingTime: '30 working days (Statutory timeline)',
    isPopular: false,
    officialPortalUrl: 'https://test-ed.cgstate.gov.in/home?lang=en',
    officialPortalName: 'Chhattisgarh Sewa Setu Portal',
    officeAssistanceInfo: 'Lok Seva Kendra (LSK), Tehsil Office, or Sub-Divisional Magistrate (Revenue) Office. Helpline: 0771-2992035.',
    conditionalNotice: 'The application references 10 August 1950 for SC and 6 September 1950 for ST regarding historic family residence in Chhattisgarh. Cases involving interstate migration require specific scrutiny.',
    hasConditionalDocs: true,
    eligibilitySummary: [
      'Applicant must belong to a Scheduled Caste or Scheduled Tribe recognized for the relevant state/area of Chhattisgarh.',
      'Must establish community lineage and historic family presence in Chhattisgarh dating back to the constitutional cut-off dates (1950).',
      'For applicants whose parent or sibling already holds a valid digital caste certificate, that certificate serves as primary supporting lineage proof.'
    ],
    requiredDocuments: [
      {
        id: 'doc-scst-caste',
        name: 'Caste & Community Proof',
        category: 'certificate',
        required: true,
        description: 'Records establishing that the applicant or family belongs to the declared SC/ST community.',
        acceptedExamples: ['Existing SC/ST certificate of father/sibling', 'Primary school transfer certificate (TC) showing caste', 'Certificate from Gram Panchayat Sarpanch / Parshad / MLA', 'Service record of parent showing caste category']
      },
      {
        id: 'doc-scst-historical',
        name: 'Historical Land / Revenue Records',
        category: 'certificate',
        required: false,
        isConditional: true,
        conditionNote: 'Crucial for proving ancestral residence on or prior to 1950. Submit where available.',
        description: 'Pre-1950 or historic government revenue records showing family name and community.',
        acceptedExamples: ['Misal Record (मिसल रिकार्ड)', 'Adhikar Abhilekh (अधिकार अभिलेख)', 'Jamabandi (जमाबंदी)', '1931/1959 Census Register', 'Dakhil/Kharij Panji (दाखिल खारिज पंजी)']
      },
      {
        id: 'doc-scst-residence',
        name: 'Residence Proof in Chhattisgarh',
        category: 'address',
        required: true,
        description: 'Proof confirming that the applicant currently resides in Chhattisgarh.',
        acceptedExamples: ['Domicile Certificate', 'Ration Card', 'Voter ID', 'Electricity Bill', 'Land/House registry papers', 'BPL Certificate']
      },
      {
        id: 'doc-scst-tree',
        name: 'Vanshavali / Family Tree (वंशावली)',
        category: 'relationship',
        required: false,
        isConditional: true,
        conditionNote: 'Required if connecting the applicant’s lineage to an older ancestor (grandfather/great-grandfather) named in historic Misal or land records.',
        description: 'Genealogical family tree verified by local community elders or Gram Panchayat.',
        acceptedExamples: ['Gram Panchayat verified genealogical chart (Vanshavali) attested by Sarpanch/Patwari']
      },
      {
        id: 'doc-scst-photo',
        name: 'Recent Photograph',
        category: 'photo',
        required: true,
        description: 'Recent passport-size photograph of the applicant.',
        acceptedExamples: ['Color photograph on plain white background']
      }
    ],
    steps: [
      'Open Chhattisgarh Sewa Setu and select SC/ST Certificate',
      'Fill applicant personal, caste, and genealogical information',
      'Upload caste evidence, historic land records, and residence proof',
      'Pay ₹30 fee and obtain application tracking number',
      'Verification by Patwari, Revenue Inspector, and SDM Scrutiny Committee',
      'Download permanent digitally signed SC/ST Certificate'
    ],
    stepDetails: [
      { step: 1, title: 'Portal Selection', description: 'Access Sewa Setu and select SC/ST Certificate under Revenue Department.' },
      { step: 2, title: 'Enter Details', description: 'Enter applicant information, father/grandfather details, community, sub-caste, and ancestral village.' },
      { step: 3, title: 'Upload Proofs', description: 'Upload father’s caste certificate, historical records (Misal/Jamabandi), and current residence proof.' },
      { step: 4, title: 'Submit & Pay', description: 'Pay ₹30 application fee and note down the application tracking number.' },
      { step: 5, title: 'Scrutiny', description: 'Patwari performs field inquiry on family heritage; Sub-Divisional Caste Scrutiny Committee verifies claims.' },
      { step: 6, title: 'Issuance', description: 'SDO approves permanent digital caste certificate with lifetime validity.' }
    ],
    importantNotes: [
      'A certificate from another state does not automatically entitle an applicant to a Chhattisgarh certificate; local roots must be proved.',
      'For rural applicants, a Gram Sabha resolution (ग्राम सभा प्रस्ताव) can serve as crucial supporting evidence.',
      'The statutory service timeline is 30 working days.'
    ],
    disclaimer: 'Based on official Chhattisgarh Sewa Setu portal rules. The Sub-Divisional Magistrate (SDM) / Competent Authority makes final decisions.'
  },

  {
    id: 'cg-caste-obc',
    name: 'Chhattisgarh Caste Certificate (OBC - अन्य पिछड़ा वर्ग)',
    category: 'Certificates',
    description: 'Other Backward Classes caste certificate with Non-Creamy Layer verification in Chhattisgarh.',
    fee: '₹30 (Official portal rate)',
    processingTime: '30 working days (Statutory timeline)',
    isPopular: false,
    officialPortalUrl: 'https://test-ed.cgstate.gov.in/home?lang=en',
    officialPortalName: 'Chhattisgarh Sewa Setu Portal',
    officeAssistanceInfo: 'Lok Seva Kendra (LSK), Tehsil Revenue Office, or SDM Office. Helpline: 0771-2992035.',
    conditionalNotice: 'Important distinction: A Chhattisgarh State OBC certificate is distinct from a Central OBC Non-Creamy Layer (NCL) certificate. State certificates apply to state recruitment/admissions; central jobs require the Central List format.',
    hasConditionalDocs: true,
    eligibilitySummary: [
      'Applicant’s caste/community must be included in the official Chhattisgarh State OBC List.',
      'Applicant must satisfy Non-Creamy Layer (NCL) income criteria based on parental income rules.',
      'Must be a permanent resident of Chhattisgarh with verifiable family presence.',
      'Both caste lineage and annual household income must be established through official records.'
    ],
    requiredDocuments: [
      {
        id: 'doc-obc-affidavit',
        name: 'Sworn Affidavit (शपथ पत्र)',
        category: 'form',
        required: true,
        description: 'Mandatory affidavit declaring caste, sub-caste, continuous residence, and non-creamy layer parental income.',
        acceptedExamples: ['Standard notary attested affidavit format specifying household income and caste declaration']
      },
      {
        id: 'doc-obc-income',
        name: 'Income Proof (for Non-Creamy Layer)',
        category: 'income',
        required: true,
        description: 'Evidence establishing annual parental income from all sources to verify Non-Creamy Layer status.',
        acceptedExamples: ['Income Certificate issued by Patwari / Tehsildar', 'Employer Form 16 / Salary Slips (if salaried)', 'Income Tax Returns (ITR)', 'Revenue land valuation record']
      },
      {
        id: 'doc-obc-caste',
        name: 'OBC Community / Caste Proof',
        category: 'certificate',
        required: true,
        description: 'Proof verifying that the family belongs to the claimed OBC community.',
        acceptedExamples: ['Father’s OBC Certificate', 'Primary school transfer certificate (TC) recording caste', 'Misal / Jamabandi / 1959 Citizen Register', 'Certificate from Sarpanch/Parshad']
      },
      {
        id: 'doc-obc-residence',
        name: 'Residence Proof in Chhattisgarh',
        category: 'address',
        required: true,
        description: 'Document proving continuous residence in Chhattisgarh.',
        acceptedExamples: ['Domicile Certificate', 'Ration Card', 'Voter ID', 'Electricity Bill', 'Ward Member / MLA Certificate']
      },
      {
        id: 'doc-obc-photo',
        name: 'Recent Photograph',
        category: 'photo',
        required: true,
        description: 'Recent passport-size photograph of the applicant.',
        acceptedExamples: ['Clear color photograph']
      }
    ],
    steps: [
      'Open Chhattisgarh Sewa Setu and select OBC Certificate',
      'Complete form with personal, community, and parental income details',
      'Upload mandatory affidavit, income proof, caste proof, and residence records',
      'Pay ₹30 fee online or at Lok Seva Kendra',
      'Patwari / Naib Tehsildar field inquiry on income and community status',
      'Issuance of digitally verifiable State OBC Certificate'
    ],
    stepDetails: [
      { step: 1, title: 'Portal Application', description: 'Log in to Sewa Setu and select OBC Certificate service under Revenue.' },
      { step: 2, title: 'Income & Lineage', description: 'Enter parental occupation, salary, agricultural land income, and sub-caste category.' },
      { step: 3, title: 'Upload Proofs', description: 'Attach notarised affidavit, Patwari income report, father’s caste record, and residence proof.' },
      { step: 4, title: 'Payment', description: 'Pay ₹30 service fee and save the Sewa Setu acknowledgement slip.' },
      { step: 5, title: 'Income Scrutiny', description: 'Revenue authority verifies whether parental income is below the creamy layer ceiling.' },
      { step: 6, title: 'Approval', description: 'Download approved certificate with digital seal and QR validation.' }
    ],
    importantNotes: [
      'State OBC certificates and Central OBC-NCL certificates are not interchangeable. Check your admission/job notification for the required format.',
      'Income proof must clearly reflect parents’ income, not the applicant’s personal employment income alone.',
      'Statutory listed timeline on Sewa Setu is 30 working days.'
    ],
    disclaimer: 'Based on official Chhattisgarh e-District / Sewa Setu regulations. Issuing revenue authority decides eligibility.'
  },

  // ==========================================
  // E. CHHATTISGARH PENSION SCHEMES
  // ==========================================
  {
    id: 'cg-pension-ignoaps',
    name: 'Indira Gandhi National Old Age Pension Scheme (IGNOAPS)',
    category: 'Pensions',
    description: 'Monthly social security pension for BPL senior citizens aged 60 and above.',
    fee: 'Free of charge',
    processingTime: '30 - 45 working days',
    isPopular: false,
    officialPortalUrl: 'https://test-ed.cgstate.gov.in/home?lang=en',
    officialPortalName: 'Chhattisgarh Sewa Setu / Social Welfare',
    officeAssistanceInfo: 'Gram Panchayat (rural), Urban Local Body / Nagar Palika (urban), or Lok Seva Kendra.',
    conditionalNotice: 'Eligibility summaries are informational guidance only. Age thresholds, benefit amounts, and current scheme conditions must be confirmed with the competent Social Welfare authority.',
    hasConditionalDocs: true,
    eligibilitySummary: [
      'Applicant must typically be aged 60 years or above (verify with local Social Welfare rules).',
      'Must belong to a household living Below the Poverty Line (BPL) according to central/state survey criteria.',
      'Must be a permanent resident of Chhattisgarh.',
      'Applicant must not be receiving an equivalent old-age pension from any other state or central government scheme.'
    ],
    requiredDocuments: [
      {
        id: 'doc-ignoaps-age',
        name: 'Age Proof (60+ Years)',
        category: 'age',
        required: true,
        description: 'Document verifying that the applicant has attained 60 years of age.',
        acceptedExamples: ['Birth Registration Certificate', 'Medical Certificate issued by Doctor / Government Hospital', 'School Marksheet', 'Voter ID Card', 'Aadhaar Card']
      },
      {
        id: 'doc-ignoaps-domicile',
        name: 'Domicile / Residence Certificate',
        category: 'address',
        required: true,
        description: 'Proof of permanent residence in Chhattisgarh issued by an authorised official or councillor.',
        acceptedExamples: ['Chhattisgarh Domicile Certificate', 'Local Ward Councillor Certificate', 'Gram Panchayat Certificate']
      },
      {
        id: 'doc-ignoaps-bpl',
        name: 'BPL-Related Document',
        category: 'income',
        required: true,
        description: 'Proof of belonging to a Below Poverty Line (BPL) family.',
        acceptedExamples: ['BPL Ration Card', 'BPL Survey Roster Number Certificate', 'Poverty Survey Household Certificate']
      },
      {
        id: 'doc-ignoaps-bank',
        name: 'Bank / Post Office Account Passbook',
        category: 'financial',
        required: false,
        isConditional: true,
        conditionNote: 'Listed as optional on the portal document list; highly recommended so pension funds can be transferred via Direct Benefit Transfer (DBT).',
        description: 'Active savings account passbook showing applicant name, account number, and IFSC code.',
        acceptedExamples: ['Copy of Bank Passbook front page or Post Office savings account passbook']
      },
      {
        id: 'doc-ignoaps-photo',
        name: 'Passport Photograph',
        category: 'photo',
        required: true,
        description: 'Recent photograph of the applicant for beneficiary record.',
        acceptedExamples: ['Recent passport-size color photograph']
      }
    ],
    steps: [
      'Confirm age (60+) and BPL household inclusion with local panchayat/urban body',
      'Submit application on Sewa Setu portal or at Gram Panchayat / LSK',
      'Attach age proof, domicile certificate, and BPL card copy',
      'Provide Aadhaar-linked Bank/Post Office account details',
      'Social Welfare Department conducts physical scrutiny and verification',
      'Sanction order issued and monthly pension credited directly via DBT'
    ],
    stepDetails: [
      { step: 1, title: 'Eligibility Check', description: 'Confirm that the applicant meets the 60+ age threshold and is listed on the official BPL survey register.' },
      { step: 2, title: 'Application Filing', description: 'Apply via Sewa Setu online or submit paper forms to the Janpad Panchayat / Nagar Nigam office.' },
      { step: 3, title: 'Attach Records', description: 'Upload verified age proof, Chhattisgarh domicile certificate, and BPL card.' },
      { step: 4, title: 'Bank Linkage', description: 'Submit Aadhaar and bank details for Direct Benefit Transfer (DBT).' },
      { step: 5, title: 'Inquiry & Approval', description: 'Gram Panchayat / Ward in-charge verifies eligibility and forwards to Social Welfare Officer.' },
      { step: 6, title: 'Monthly Benefit', description: 'Sanction letter issued; monthly financial pension credited to beneficiary bank account.' }
    ],
    importantNotes: [
      'Applications can be submitted completely free of charge at government centres.',
      'Ensure bank account is Aadhaar-seeded for smooth DBT credit without rejection.',
      'Scheme terms and benefit amounts are subject to state social welfare revisions.'
    ],
    disclaimer: 'Based on official Chhattisgarh Sewa Setu Social Welfare guidelines. Final pension sanction is subject to department scrutiny.'
  },

  {
    id: 'cg-pension-ignwps',
    name: 'Indira Gandhi National Widow Pension Scheme (IGNWPS)',
    category: 'Pensions',
    description: 'Monthly pension assistance for eligible widowed women from BPL families in Chhattisgarh.',
    fee: 'Free of charge',
    processingTime: '30 - 45 working days',
    isPopular: false,
    officialPortalUrl: 'https://test-ed.cgstate.gov.in/home?lang=en',
    officialPortalName: 'Chhattisgarh Sewa Setu Portal',
    officeAssistanceInfo: 'Gram Panchayat (rural), Ward Office / Nagar Palika (urban), or District Social Welfare Department.',
    conditionalNotice: 'Husband’s death certificate is mandatory. Age guidelines associate with widowed women aged 40–79; confirm current state age threshold with the Social Welfare Department.',
    hasConditionalDocs: true,
    eligibilitySummary: [
      'Applicant must meet the scheme’s definition of a widow (widowed female resident).',
      'National scheme rules generally specify age 40 to 79 years; confirm the exact Chhattisgarh age criteria with the competent authority.',
      'Must belong to a household listed Below the Poverty Line (BPL).',
      'Must be a permanent resident of Chhattisgarh and must not have remarried.'
    ],
    requiredDocuments: [
      {
        id: 'doc-ignwps-death',
        name: 'Husband’s Death Certificate (मृत्यु प्रमाण पत्र)',
        category: 'certificate',
        required: true,
        description: 'Mandatory death certificate of deceased husband issued by the competent registrar.',
        acceptedExamples: ['Death Certificate issued by Registrar of Births & Deaths / Municipal Corporation / Gram Panchayat']
      },
      {
        id: 'doc-ignwps-age',
        name: 'Age Proof',
        category: 'age',
        required: true,
        description: 'Proof establishing applicant’s age within qualifying range.',
        acceptedExamples: ['Birth Certificate', 'Aadhaar Card', 'Voter ID', 'Doctor / Medical Officer certificate', 'School Marksheet']
      },
      {
        id: 'doc-ignwps-domicile',
        name: 'Domicile / Residence Certificate',
        category: 'address',
        required: true,
        description: 'Residence proof showing permanent domicile in Chhattisgarh.',
        acceptedExamples: ['Chhattisgarh Domicile Certificate', 'Local Ward Councillor Certificate', 'Gram Panchayat residence proof']
      },
      {
        id: 'doc-ignwps-bpl',
        name: 'BPL-Related Document',
        category: 'income',
        required: true,
        description: 'Proof of family inclusion in Below Poverty Line (BPL) roster.',
        acceptedExamples: ['BPL Ration Card', 'BPL Survey Register inclusion certificate']
      },
      {
        id: 'doc-ignwps-bank',
        name: 'Bank / Post Office Passbook',
        category: 'financial',
        required: false,
        isConditional: true,
        conditionNote: 'Listed as optional on portal, but practically required for monthly pension disbursement into the applicant’s bank account.',
        description: 'Savings account passbook with IFSC and applicant name.',
        acceptedExamples: ['Front page copy of Bank / Post Office savings passbook']
      },
      {
        id: 'doc-ignwps-photo',
        name: 'Passport Photograph',
        category: 'photo',
        required: true,
        description: 'Recent photograph of the applicant.',
        acceptedExamples: ['Passport-size color photo']
      }
    ],
    steps: [
      'Obtain official death certificate of deceased husband',
      'Verify age and BPL eligibility criteria with local social welfare authority',
      'Apply online via Sewa Setu or submit at Janpad / Municipal office',
      'Attach husband death certificate, age proof, domicile, and BPL card',
      'Provide active bank account details for direct transfer',
      'Field scrutiny by Social Welfare Inspector',
      'Monthly pension sanctioned upon departmental verification'
    ],
    stepDetails: [
      { step: 1, title: 'Death Certificate', description: 'Ensure husband’s death is registered and obtain the official digital death certificate.' },
      { step: 2, title: 'Form Submission', description: 'Submit the application online on Sewa Setu or through the local Janpad / Municipal office.' },
      { step: 3, title: 'Upload Proofs', description: 'Upload death certificate, age proof, domicile proof, and BPL card.' },
      { step: 4, title: 'Bank Linkage', description: 'Provide Aadhaar-linked bank account passbook for Direct Benefit Transfer.' },
      { step: 5, title: 'Social Scrutiny', description: 'Social Welfare team inspects marital status and living conditions.' },
      { step: 6, title: 'Monthly Credit', description: 'Sanction letter generated and monthly assistance credited.' }
    ],
    importantNotes: [
      'If the applicant remarries, eligibility under the widow pension scheme ceases.',
      'Death certificate must be issued by an authorized civil registration authority; hospital discharge slips alone are not sufficient.'
    ],
    disclaimer: 'Based on official Chhattisgarh Sewa Setu Social Welfare guidelines. The Social Welfare Department determines final approval.'
  },

  {
    id: 'cg-pension-igndps',
    name: 'Indira Gandhi National Disability Pension Scheme (IGNDPS)',
    category: 'Pensions',
    description: 'Monthly disability pension for persons with severe disabilities from BPL households.',
    fee: 'Free of charge',
    processingTime: '30 - 45 working days',
    isPopular: false,
    officialPortalUrl: 'https://www.myscheme.gov.in/schemes/igndps-chhattisgarh',
    officialPortalName: 'myScheme / CG Social Welfare',
    officeAssistanceInfo: 'Gram Panchayat (rural), Urban Local Body (urban), District Disability Rehabilitation Centre, or Lok Seva Kendra.',
    conditionalNotice: 'Disability certificate from an authorized Medical Board certifying 80% or greater disability (or multiple disabilities) is strictly mandatory. Benefit is ₹500/month (verify current revision with authority).',
    hasConditionalDocs: true,
    eligibilitySummary: [
      'Applicant should be a bona fide native / resident of Chhattisgarh.',
      'Age between 18 and 79 years (as listed on myScheme Chhattisgarh).',
      'Severe disability of 80% or above, or multiple disabilities, certified by competent Medical Authority.',
      'Applicant must belong to a Below Poverty Line (BPL) household.',
      'Must not be receiving pension benefits from any other Central or State Government pension scheme.'
    ],
    requiredDocuments: [
      {
        id: 'doc-igndps-discert',
        name: 'Disability Certificate (80%+ / Multiple Disabilities)',
        category: 'disability',
        required: true,
        description: 'Mandatory medical certificate certifying severe disability percentage (80% or above) or multiple disabilities.',
        acceptedExamples: ['UDID Card (Unique Disability ID)', 'Disability Certificate issued by District Medical Board / Civil Surgeon']
      },
      {
        id: 'doc-igndps-aadhaar',
        name: 'Aadhaar Card',
        category: 'identity',
        required: true,
        description: 'Applicant’s Aadhaar card for biometric identification and DBT verification.',
        acceptedExamples: ['Aadhaar Card / e-Aadhaar']
      },
      {
        id: 'doc-igndps-domicile',
        name: 'Chhattisgarh Domicile Certificate',
        category: 'address',
        required: true,
        description: 'Document proving native status / permanent domicile in Chhattisgarh.',
        acceptedExamples: ['Chhattisgarh Domicile Certificate', 'Local revenue authority native certificate']
      },
      {
        id: 'doc-igndps-bpl',
        name: 'BPL Card / Related Documents',
        category: 'income',
        required: true,
        description: 'Proof of belonging to a Below Poverty Line (BPL) household.',
        acceptedExamples: ['BPL Ration Card', 'BPL Survey list entry certificate']
      },
      {
        id: 'doc-igndps-age',
        name: 'Age Proof (18 to 79 Years)',
        category: 'age',
        required: true,
        description: 'Proof establishing applicant’s age within 18 to 79 years.',
        acceptedExamples: ['Birth Certificate', 'Doctor / Medical board certificate', 'School Certificate', 'Voter ID Card']
      },
      {
        id: 'doc-igndps-bank',
        name: 'Bank / Post Office Account Passbook',
        category: 'financial',
        required: true,
        description: 'Active bank account details for monthly pension payment.',
        acceptedExamples: ['Front page copy of Bank / Post Office passbook showing account number and IFSC']
      },
      {
        id: 'doc-igndps-photo',
        name: 'Passport Photograph',
        category: 'photo',
        required: true,
        description: 'Recent passport-size photograph of the applicant.',
        acceptedExamples: ['Recent color photograph']
      },
      {
        id: 'doc-igndps-address',
        name: 'Residential Address Proof',
        category: 'address',
        required: true,
        description: 'Document verifying current residential address in Chhattisgarh.',
        acceptedExamples: ['Ration Card', 'Voter ID Card', 'Electricity Bill']
      }
    ],
    steps: [
      'Obtain UDID / Medical Board Disability Certificate (80%+)',
      'Confirm BPL inclusion and Chhattisgarh domicile status',
      'Submit application on Sewa Setu or offline at Gram Panchayat / Nagar Nigam',
      'Upload disability certificate, BPL proof, domicile, and Aadhaar',
      'Link bank account with Aadhaar for Direct Benefit Transfer',
      'Scrutiny by Social Welfare Officer and Medical Superintendent',
      'Pension sanctioned and monthly benefit disbursed'
    ],
    stepDetails: [
      { step: 1, title: 'Disability Assessment', description: 'Undergo medical assessment at District Hospital to obtain a valid UDID / 80%+ disability certificate.' },
      { step: 2, title: 'Application Entry', description: 'Fill the disability pension form on Sewa Setu or submit at the Janpad Panchayat / Municipal Corporation.' },
      { step: 3, title: 'Attach Documents', description: 'Attach disability certificate, BPL card, domicile certificate, Aadhaar, and bank passbook.' },
      { step: 4, title: 'Bank Linkage', description: 'Ensure the bank account is Aadhaar-linked for DBT processing.' },
      { step: 5, title: 'Scrutiny & Sanction', description: 'Social Welfare Officer scrutinises records and verifies non-receipt of other pensions.' },
      { step: 6, title: 'Monthly Benefit', description: 'Receive ₹500/month directly into your bank account (verify current state revision).' }
    ],
    importantNotes: [
      'The disability certificate must explicitly specify at least 80% permanent disability or multiple disabilities.',
      'No application fee is charged at any government office.',
      'Beneficiaries must not receive any other central or state pension simultaneously.'
    ],
    disclaimer: 'Based on official myScheme and Chhattisgarh Social Welfare criteria. Verification by competent medical and social welfare authorities is final.'
  },

  // ==========================================
  // F. DRIVING LICENCE SERVICES
  // ==========================================
  {
    id: 'dl-learners',
    name: 'Learner’s Licence (LL)',
    category: 'Transport',
    description: 'Initial licence to practice driving on Indian roads under licensed instructor supervision.',
    fee: '₹150 - ₹200 (Application & test fee as per State RTO schedule)',
    processingTime: '1 - 7 working days (Instant online after computer test)',
    isPopular: true,
    officialPortalUrl: 'https://sarathi.parivahan.gov.in',
    officialPortalName: 'MoRTH Sarathi Parivahan',
    officeAssistanceInfo: 'Regional Transport Office (RTO) or online Aadhaar-based faceless service (available in participating states).',
    conditionalNotice: 'Requirements vary by state and whether applying through Aadhaar faceless mode or in-person RTO visit. Medical Certificate (Form 1A) is mandatory if applicant is aged 40+.',
    hasConditionalDocs: true,
    eligibilitySummary: [
      'Minimum age 16: For non-geared motorcycle with engine capacity up to 50cc (requires written parental/guardian consent).',
      'Minimum age 18: For light motor vehicles (motorcycle with gear, car).',
      'Minimum age 20: For transport/commercial vehicles (requires holding an LMV licence for at least one year).',
      'Must possess basic knowledge of road signs, traffic regulations, and safe driving.'
    ],
    requiredDocuments: [
      {
        id: 'doc-ll-age',
        name: 'Proof of Age / Date of Birth',
        category: 'age',
        required: true,
        description: 'Document confirming applicant has attained the statutory age limit.',
        acceptedExamples: ['10th Standard Marksheet / Board Certificate', 'Birth Certificate', 'Indian Passport', 'PAN Card', 'School Leaving Certificate']
      },
      {
        id: 'doc-ll-address',
        name: 'Proof of Current Address',
        category: 'address',
        required: true,
        description: 'Document establishing current residence within the RTO jurisdiction.',
        acceptedExamples: ['Aadhaar Card', 'Voter ID', 'Indian Passport', 'Electricity / Water Bill', 'LIC Policy Document', 'Ration Card']
      },
      {
        id: 'doc-ll-form1',
        name: 'Physical Fitness Self-Declaration (Form 1)',
        category: 'medical',
        required: true,
        description: 'Self-declaration as to physical fitness completed online on Sarathi Parivahan portal.',
        acceptedExamples: ['Generated directly on Sarathi Parivahan portal during online application']
      },
      {
        id: 'doc-ll-form1a',
        name: 'Medical Certificate (Form 1A)',
        category: 'medical',
        required: false,
        isConditional: true,
        conditionNote: 'Mandatory if applicant is 40 years of age or older, or if applying for transport/commercial vehicle licence.',
        description: 'Medical certificate issued and signed by a registered medical practitioner (doctor).',
        acceptedExamples: ['Form 1A signed by registered MBBS doctor with medical registration number']
      },
      {
        id: 'doc-ll-parent',
        name: 'Parental / Guardian Consent Form',
        category: 'relationship',
        required: false,
        isConditional: true,
        conditionNote: 'Mandatory only for applicants between 16 and 18 years applying for motorcycle without gear (up to 50cc).',
        description: 'Signed consent letter by parent or legal guardian.',
        acceptedExamples: ['Consent declaration signed by parent/guardian in presence of licensing authority']
      },
      {
        id: 'doc-ll-photo',
        name: 'Passport Photograph & Signature',
        category: 'photo',
        required: true,
        description: 'Clear photograph and digital signature specimen for licence printing.',
        acceptedExamples: ['Scanned photo and signature or pulled directly from Aadhaar during e-KYC']
      }
    ],
    steps: [
      'Open sarathi.parivahan.gov.in and select your state',
      'Select "Apply for Learner Licence" and fill personal/address form',
      'Upload age proof, address proof, and Form 1 fitness self-declaration',
      'Pay application and test fee online',
      'Take online LL test (if Aadhaar e-KYC enabled) or book RTO slot',
      'Pass traffic rules test and download instant digital Learner Licence'
    ],
    stepDetails: [
      { step: 1, title: 'State Selection', description: 'Visit sarathi.parivahan.gov.in and select your state of residence.' },
      { step: 2, title: 'Application Entry', description: 'Choose "Apply for Learner Licence" and enter personal details, address, and vehicle class.' },
      { step: 3, title: 'Upload Proofs', description: 'Upload age proof, address proof, photo, and signature (or authenticate via Aadhaar e-KYC).' },
      { step: 4, title: 'Fee Payment', description: 'Pay the prescribed state licence fee online through Parivahan payment gateway.' },
      { step: 5, title: 'LL Test', description: 'Take the online traffic signs and safety test from home (e-KYC) or at the RTO test room.' },
      { step: 6, title: 'Download LL', description: 'Upon passing, instantly download your digital Learner Licence valid for 6 months across India.' }
    ],
    importantNotes: [
      'A Learner’s Licence is valid for 6 months from the date of issue.',
      'You can apply for a Permanent Driving Licence after holding a Learner’s Licence for at least 30 days.',
      'Check whether your state provides faceless (contactless) LL tests from home using Aadhaar authentication.'
    ],
    disclaimer: 'Based on Central Motor Vehicles Rules (CMVR) and MoRTH Sarathi portal. State-specific rules and fees govern final licensing.'
  },

  {
    id: 'dl-permanent',
    name: 'New Driving Licence (Permanent DL)',
    category: 'Transport',
    description: 'Apply for a permanent Driving Licence after completing the mandatory 30-day Learner Licence training period.',
    fee: '₹700 - ₹1,000 (Test fee + smart card DL fee as per State RTO)',
    processingTime: '7 - 15 working days after passing driving test',
    isPopular: true,
    officialPortalUrl: 'https://sarathi.parivahan.gov.in',
    officialPortalName: 'Sarathi Parivahan Portal',
    officeAssistanceInfo: 'Automated Driving Test Track (ADTT) or local Regional Transport Office (RTO).',
    conditionalNotice: 'Applicant must bring a vehicle of the matching category (with valid RC, Insurance, and PUC) to the RTO for the practical driving competence test.',
    hasConditionalDocs: true,
    eligibilitySummary: [
      'Must hold an active Learner Licence for the vehicle category.',
      'Must have held the Learner Licence for a minimum of 30 days and within its 180-day validity period.',
      'Must pass practical driving test on the testing track at RTO.',
      'Commercial/transport vehicle applicants must be at least 20 years old and have completed training from an accredited driving school.'
    ],
    requiredDocuments: [
      {
        id: 'doc-dl-ll',
        name: 'Valid Learner’s Licence',
        category: 'existing',
        required: true,
        description: 'Active Learner Licence held for minimum 30 days and within 180-day validity.',
        acceptedExamples: ['Digital or printed Learner Licence issued on Sarathi Parivahan']
      },
      {
        id: 'doc-dl-form4',
        name: 'Application Form 4',
        category: 'form',
        required: true,
        description: 'Application for licence to drive a motor vehicle generated online.',
        acceptedExamples: ['Generated online from sarathi.parivahan.gov.in']
      },
      {
        id: 'doc-dl-form5',
        name: 'Driving School Certificate (Form 5)',
        category: 'certificate',
        required: false,
        isConditional: true,
        conditionNote: 'Mandatory if trained at an accredited driving training school or applying for commercial/transport vehicle category.',
        description: 'Certificate of driving competence issued by recognized motor driving training school.',
        acceptedExamples: ['Form 5 issued by state-accredited driving school']
      },
      {
        id: 'doc-dl-vehicle',
        name: 'Vehicle Documents for Practical Test',
        category: 'existing',
        required: true,
        description: 'Valid vehicle documents for the test vehicle brought to the RTO track.',
        acceptedExamples: ['Registration Certificate (RC)', 'Valid Motor Insurance Policy', 'Pollution Under Control (PUC) Certificate']
      },
      {
        id: 'doc-dl-slot',
        name: 'Driving Test Appointment Slot Receipt',
        category: 'form',
        required: true,
        description: 'Appointment slip confirming date and time of practical driving test.',
        acceptedExamples: ['Slot booking receipt printed from Sarathi portal']
      }
    ],
    steps: [
      'Open sarathi.parivahan.gov.in and select "Apply for Driving Licence"',
      'Enter Learner Licence number and date of birth',
      'Book practical driving test appointment slot at your RTO track',
      'Pay driving test and smart card licence fee online',
      'Appear for practical driving test with matching vehicle and documents',
      'Provide biometrics and photograph upon passing test',
      'Track dispatch and receive smart card DL via Speed Post'
    ],
    stepDetails: [
      { step: 1, title: 'Enter LL Details', description: 'Log in with your Learner Licence number on Sarathi Parivahan.' },
      { step: 2, title: 'Book Slot', description: 'Select an available date and time slot for the practical driving test at the RTO track.' },
      { step: 3, title: 'Fee Payment', description: 'Pay the driving test fee and smart card issue fee online.' },
      { step: 4, title: 'Driving Test', description: 'Attend the RTO automated track with your test vehicle and pass the 8-track / H-track test.' },
      { step: 5, title: 'Biometrics', description: 'Capture digital photograph and fingerprints at the RTO counter.' },
      { step: 6, title: 'Dispatch', description: 'Once approved by the Motor Vehicle Inspector, your smart card DL is dispatched via Speed Post.' }
    ],
    importantNotes: [
      'If you fail the practical test, you can re-book a test slot after 7 days upon paying the re-test fee.',
      'Smart card driving licences are valid for 20 years from issuance or until age 40, whichever is earlier.'
    ],
    disclaimer: 'Based on Central Motor Vehicles Rules. State RTO automated test procedures govern driving licence issuance.'
  },

  {
    id: 'dl-renewal',
    name: 'Driving Licence Renewal',
    category: 'Transport',
    description: 'Renew an expired or soon-to-expire driving licence to maintain legal authorisation to operate motor vehicles.',
    fee: '₹400 - ₹500 (Late fee of ₹1,000/year applies if expired over 1 year)',
    processingTime: '5 - 10 working days',
    isPopular: false,
    officialPortalUrl: 'https://sarathi.parivahan.gov.in',
    officialPortalName: 'Sarathi Parivahan Portal',
    officeAssistanceInfo: 'Regional Transport Office (RTO) or online Aadhaar-authenticated service.',
    conditionalNotice: 'Medical Certificate (Form 1A) by a registered doctor is mandatory if applicant is aged 40 years or older. If licence is expired for more than 1 year, a driving re-test is mandatory.',
    hasConditionalDocs: true,
    eligibilitySummary: [
      'Holders of an expired Driving Licence or licence nearing expiry (can apply within 1 year before or after expiry).',
      'If renewed within 1 year of expiry, validity continues without re-examination.',
      'If renewal is filed after 1 year of expiry, the applicant must pass a driving re-test under amended Motor Vehicles rules.',
      'Commercial/transport licences require renewal every 3 to 5 years depending on vehicle type.'
    ],
    requiredDocuments: [
      {
        id: 'doc-dlren-orig',
        name: 'Original Driving Licence',
        category: 'existing',
        required: true,
        description: 'Physical driving licence to be renewed (details verified on Sarathi database).',
        acceptedExamples: ['Physical DL card or digital record on Sarathi database']
      },
      {
        id: 'doc-dlren-form2',
        name: 'Application Form 2 for Renewal',
        category: 'form',
        required: true,
        description: 'Consolidated application form for renewal generated online on Sarathi.',
        acceptedExamples: ['Generated online from sarathi.parivahan.gov.in']
      },
      {
        id: 'doc-dlren-form1a',
        name: 'Medical Certificate (Form 1A)',
        category: 'medical',
        required: false,
        isConditional: true,
        conditionNote: 'Mandatory if the applicant is 40 years of age or older, or holding a transport/commercial licence.',
        description: 'Certificate of medical fitness signed by a registered MBBS medical practitioner.',
        acceptedExamples: ['Form 1A issued and stamped by registered medical practitioner']
      },
      {
        id: 'doc-dlren-address',
        name: 'Proof of Present Address',
        category: 'address',
        required: false,
        isConditional: true,
        conditionNote: 'Required only if present residential address has changed from the address printed on the original DL.',
        description: 'Document verifying current residence.',
        acceptedExamples: ['Aadhaar Card', 'Voter ID', 'Passport', 'Electricity Bill']
      },
      {
        id: 'doc-dlren-photo',
        name: 'Passport Photograph',
        category: 'photo',
        required: true,
        description: 'Recent photograph for licence record update.',
        acceptedExamples: ['Passport-size color photo']
      }
    ],
    steps: [
      'Select "Services on DL" on sarathi.parivahan.gov.in',
      'Enter DL number and Date of Birth to fetch licence details',
      'Select "Renewal of DL" from the available services menu',
      'Upload Form 1A medical fitness certificate (if age 40+) and address proof if changed',
      'Pay renewal fee online',
      'Submit application (faceless in enabled states, or visit RTO if required)',
      'Download updated digital DL on mParivahan / DigiLocker and receive smart card'
    ],
    stepDetails: [
      { step: 1, title: 'Fetch Record', description: 'Enter existing DL number and date of birth on Sarathi Parivahan to view licensing records.' },
      { step: 2, title: 'Choose Renewal', description: 'Select "Renewal of DL" and verify current address and vehicle classes.' },
      { step: 3, title: 'Upload Proofs', description: 'Upload Form 1A medical fitness certificate (if 40+) and address proof if you have relocated.' },
      { step: 4, title: 'Pay Fee', description: 'Pay the statutory renewal fee online (late fee applies if expired over 1 year).' },
      { step: 5, title: 'Submission', description: 'Submit via Aadhaar e-KYC (contactless) or visit the RTO counter with physical documents.' },
      { step: 6, title: 'Card Delivery', description: 'Updated licence is generated; smart card is dispatched via Speed Post.' }
    ],
    importantNotes: [
      'Applying for renewal before expiry or within 30 days retains original validity continuity.',
      'Delay exceeding 1 year incurs a statutory late fee of ₹1,000 per year and requires a driving re-test.'
    ],
    disclaimer: 'Based on Central Motor Vehicles Rules (CMVR). State transport department guidelines govern final renewal.'
  },

  {
    id: 'dl-duplicate',
    name: 'Duplicate Driving Licence',
    category: 'Transport',
    description: 'Replacement driving licence for lost, stolen, or damaged original licence cards.',
    fee: '₹400 - ₹500 (As per State RTO fee rules)',
    processingTime: '7 - 15 working days',
    isPopular: false,
    officialPortalUrl: 'https://sarathi.parivahan.gov.in',
    officialPortalName: 'Sarathi Parivahan Portal',
    officeAssistanceInfo: 'Regional Transport Office (RTO) where licence was originally issued or registered.',
    conditionalNotice: 'If licence was lost or stolen, an online Police Lost Report / FIR acknowledgement is mandatory. If damaged or defaced, the physical damaged card must be surrendered.',
    hasConditionalDocs: true,
    eligibilitySummary: [
      'Holder of an active, valid driving licence registered on the Sarathi national database.',
      'Original physical licence is lost, stolen, completely defaced, mutilated, or torn.',
      'Must have existing DL number and personal details matching the licensing database.'
    ],
    requiredDocuments: [
      {
        id: 'doc-dldup-fir',
        name: 'Police Lost Report / FIR Acknowledgement',
        category: 'certificate',
        required: false,
        isConditional: true,
        conditionNote: 'Mandatory if the driving licence was lost or stolen. Not required if applying due to physical card damage.',
        description: 'Official police acknowledgement of lost article report.',
        acceptedExamples: ['State Police portal online lost article report receipt or Police Station FIR copy']
      },
      {
        id: 'doc-dldup-damaged',
        name: 'Defaced / Mutilated Original DL',
        category: 'existing',
        required: false,
        isConditional: true,
        conditionNote: 'Mandatory to be surrendered if applying due to physical card damage, mutilation, or torn plastic.',
        description: 'Physical torn/defaced driving licence card.',
        acceptedExamples: ['Damaged physical smart card surrendered at RTO counter']
      },
      {
        id: 'doc-dldup-form2',
        name: 'Application Form 2 for Duplicate DL',
        category: 'form',
        required: true,
        description: 'Application for duplicate driving licence generated on Sarathi.',
        acceptedExamples: ['Generated online from sarathi.parivahan.gov.in']
      },
      {
        id: 'doc-dldup-address',
        name: 'Current Address Proof',
        category: 'address',
        required: true,
        description: 'Document confirming current residence matching RTO record.',
        acceptedExamples: ['Aadhaar Card', 'Voter ID', 'Passport', 'Utility Bill']
      },
      {
        id: 'doc-dldup-photo',
        name: 'Passport Photograph',
        category: 'photo',
        required: true,
        description: 'Recent photograph for duplicate smart card printing.',
        acceptedExamples: ['Recent color photograph']
      }
    ],
    steps: [
      'File online lost article report with state police if licence was lost',
      'Open sarathi.parivahan.gov.in and select "Apply for Duplicate DL"',
      'Enter DL number and date of birth to retrieve licensing record',
      'Upload police lost report (if lost) or photo of damaged card',
      'Pay duplicate licence fee online',
      'Submit application and receive replacement smart card via Speed Post'
    ],
    stepDetails: [
      { step: 1, title: 'Police Report', description: 'If lost, lodge an online lost property report on your State Police portal and save the digital acknowledgement.' },
      { step: 2, title: 'Sarathi Application', description: 'Log in to Sarathi Parivahan, choose "Issue of Duplicate DL", and select reason (Lost / Torn / Defaced).' },
      { step: 3, title: 'Upload Proofs', description: 'Upload police lost report copy or photo of defaced DL card along with address proof.' },
      { step: 4, title: 'Payment', description: 'Pay the prescribed duplicate licence fee online.' },
      { step: 5, title: 'RTO Scrutiny', description: 'Licensing authority verifies against the national register and approves reprint.' },
      { step: 6, title: 'Delivery', description: 'Replacement smart card DL is printed and delivered by Speed Post.' }
    ],
    importantNotes: [
      'If you recover the lost original licence after receiving the duplicate, you must surrender the duplicate to the RTO.',
      'You can also download a digitally signed virtual DL on the DigiLocker and mParivahan apps immediately after approval.'
    ],
    disclaimer: 'Based on Central Motor Vehicles Rules. State transport department procedures govern duplicate licence dispatch.'
  },

  // ==========================================
  // G. TAXATION - PAN CARD CORRECTION (PRESERVED)
  // ==========================================
  {
    id: 'pan-correction',
    name: 'PAN Card Correction / Reprint',
    category: 'Taxation',
    description: 'Update name, photograph, date of birth, or address on existing PAN card.',
    fee: '₹110 (Physical card dispatched in India)',
    processingTime: '7 - 10 working days',
    isPopular: true,
    officialPortalUrl: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
    officialPortalName: 'Protean / NSDL e-Gov Portal',
    officeAssistanceInfo: 'Authorized NSDL / UTIITSL PAN facilitation centres and TIN-FC offices.',
    conditionalNotice: 'PAN verification supports automated OCR discrepancy checking in SevaGuide. Name and date of birth are cross-checked against applicant profile.',
    hasConditionalDocs: false,
    eligibilitySummary: [
      'Existing PAN card holders who need to correct typographical errors, change marital surname, update father’s name, or request a reprint of damaged/lost cards.',
      'Applicant must already possess a 10-character alphanumeric PAN issued by the Income Tax Department.'
    ],
    requiredDocuments: [
      {
        id: 'doc-pan',
        name: 'Existing PAN Proof',
        category: 'existing',
        required: true,
        description: 'Copy of existing PAN card or PAN allotment letter to substantiate existing number.',
        acceptedExamples: ['Copy of PAN card', 'Official PAN Allotment Letter', 'e-PAN PDF copy']
      },
      {
        id: 'doc-identity',
        name: 'Proof of Identity (PoI)',
        category: 'identity',
        required: true,
        description: 'Government photo identity proof showing correct name spelling.',
        acceptedExamples: ['Aadhaar Card', 'Indian Passport', 'Voter ID', 'Driving Licence', 'Bank Certificate with photo']
      },
      {
        id: 'doc-address',
        name: 'Proof of Address (PoA)',
        category: 'address',
        required: true,
        description: 'Document confirming current communication/residential address.',
        acceptedExamples: ['Aadhaar Card', 'Utility Bill (Electricity, Water, Gas within 3 months)', 'Bank Account Statement', 'Passport']
      },
      {
        id: 'doc-photo',
        name: 'Passport Photograph',
        category: 'photo',
        required: true,
        description: 'Recent color photograph with white background for new card printing.',
        acceptedExamples: ['3.5cm x 2.5cm color photograph on white background']
      }
    ],
    steps: [
      'Prepare Documents',
      'Check Mismatches',
      'Fill NSDL/UTIITSL Form',
      'Submit Physical or e-Sign',
      'Receive Updated Card'
    ],
    stepDetails: [
      { step: 1, title: 'Prepare Documents', description: 'Gather proof of identity, address, and copy of existing PAN card.' },
      { step: 2, title: 'Pre-Submission Check', description: 'Run SevaGuide’s automated pre-submission check to detect name and DoB discrepancies.' },
      { step: 3, title: 'Fill Online Form', description: 'Complete Form 49A/Correction on Protean (NSDL) or UTIITSL portal.' },
      { step: 4, title: 'e-Sign / Submit', description: 'Submit using Aadhaar OTP e-Sign or send physical signed documents to the TIN-FC office.' },
      { step: 5, title: 'Card Delivery', description: 'Receive updated physical PAN card at your registered address.' }
    ],
    importantNotes: [
      'SevaGuide provides browser-based OCR and rule-based validation for PAN cards.',
      'Check that name on identity proof matches the correction request exactly.'
    ],
    disclaimer: 'Based on Income Tax Department / Protean guidelines. Income Tax Department issues final PAN corrections.'
  }
];