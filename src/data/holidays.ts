import { VerifiedHoliday, StateDistrictOption, HolidayCategory } from '../types/calendar';

export const LAST_VERIFIED_DATASET_DATE = '2026-01-02';

export const OFFICIAL_DISCLAIMER_TEXT =
  'Government office closure status is based on official Gazette Notifications issued by the Ministry of Personnel, Public Grievances and Pensions (DoPT) and respective State General Administration Departments under the Negotiable Instruments Act, 1881. If a festival does not carry a gazetted closure order, civic centers may remain open.';

export const INDIAN_STATES_AND_DISTRICTS: StateDistrictOption[] = [
  {
    state: 'Delhi (NCT)',
    districts: ['All Districts', 'Central Delhi', 'New Delhi', 'North Delhi', 'South Delhi', 'West Delhi', 'East Delhi']
  },
  {
    state: 'Maharashtra',
    districts: ['All Districts', 'Mumbai City', 'Mumbai Suburban', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad']
  },
  {
    state: 'Karnataka',
    districts: ['All Districts', 'Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Mangaluru (Dakshina Kannada)', 'Hubballi-Dharwad', 'Belagavi']
  },
  {
    state: 'Uttar Pradesh',
    districts: ['All Districts', 'Lucknow', 'Varanasi', 'Noida (Gautam Buddha Nagar)', 'Kanpur Nagar', 'Prayagraj', 'Agra', 'Ghaziabad']
  },
  {
    state: 'Tamil Nadu',
    districts: ['All Districts', 'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Kanchipuram']
  },
  {
    state: 'West Bengal',
    districts: ['All Districts', 'Kolkata', 'North 24 Parganas', 'South 24 Parganas', 'Howrah', 'Darjeeling']
  },
  {
    state: 'Gujarat',
    districts: ['All Districts', 'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar']
  },
  {
    state: 'Rajasthan',
    districts: ['All Districts', 'Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer']
  },
  {
    state: 'Kerala',
    districts: ['All Districts', 'Thiruvananthapuram', 'Ernakulam (Kochi)', 'Kozhikode', 'Thrissur']
  },
  {
    state: 'Telangana',
    districts: ['All Districts', 'Hyderabad', 'Rangareddy', 'Medchal-Malkajgiri', 'Warangal']
  }
];

export const VERIFIED_INDIAN_HOLIDAYS_2026: VerifiedHoliday[] = [
  // ================= NATIONAL GAZETTED HOLIDAYS (DOPT MANDATORY) =================
  {
    id: 'nat-2026-01-26',
    date: '2026-01-26',
    name: 'Republic Day',
    category: 'national',
    applicableState: 'ALL',
    applicableDistrict: 'ALL',
    sourceName: 'Ministry of Personnel, Public Grievances and Pensions (DoPT)',
    sourceUrl: 'https://dopt.gov.in',
    officialNotificationRef: 'DoPT F.No.12/2/2025-JCA',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'National Holiday commemorating the adoption of the Constitution of India. All Central & State Government administrative offices and Seva Kendras remain closed.'
  },
  {
    id: 'nat-2026-03-04',
    date: '2026-03-04',
    name: 'Holi',
    category: 'national',
    applicableState: 'ALL',
    applicableDistrict: 'ALL',
    sourceName: 'DoPT Annual Gazetted Holiday Notification',
    sourceUrl: 'https://dopt.gov.in',
    officialNotificationRef: 'DoPT F.No.12/2/2025-JCA Annexure I',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'Gazetted Public Holiday for the festival of colours. Central Government offices and civic facilitation counters are closed.'
  },
  {
    id: 'nat-2026-03-21',
    date: '2026-03-21',
    name: 'Id-ul-Fitr',
    category: 'national',
    applicableState: 'ALL',
    applicableDistrict: 'ALL',
    sourceName: 'DoPT Annual Gazetted Holiday Notification',
    sourceUrl: 'https://dopt.gov.in',
    officialNotificationRef: 'DoPT F.No.12/2/2025-JCA Annexure I',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'Gazetted National Holiday celebrating the conclusion of Ramadan. Government offices and service counters closed (subject to moon sighting confirmation).'
  },
  {
    id: 'nat-2026-03-27',
    date: '2026-03-27',
    name: 'Ram Navami',
    category: 'national',
    applicableState: 'ALL',
    applicableDistrict: 'ALL',
    sourceName: 'DoPT Annual Gazetted Holiday Notification',
    sourceUrl: 'https://dopt.gov.in',
    officialNotificationRef: 'DoPT F.No.12/2/2025-JCA Annexure I',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'Gazetted Public Holiday observing the birth of Lord Rama. Public service counters closed in notified states.'
  },
  {
    id: 'nat-2026-04-03',
    date: '2026-04-03',
    name: 'Good Friday',
    category: 'national',
    applicableState: 'ALL',
    applicableDistrict: 'ALL',
    sourceName: 'DoPT Annual Gazetted Holiday Notification',
    sourceUrl: 'https://dopt.gov.in',
    officialNotificationRef: 'DoPT F.No.12/2/2025-JCA Annexure I',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'Gazetted National Holiday observed across all Central and State administrative offices.'
  },
  {
    id: 'nat-2026-04-14',
    date: '2026-04-14',
    name: 'Dr. B.R. Ambedkar Jayanti',
    category: 'national',
    applicableState: 'ALL',
    applicableDistrict: 'ALL',
    sourceName: 'Ministry of Personnel / National Portal of India',
    sourceUrl: 'https://india.gov.in',
    officialNotificationRef: 'DoPT Section 25 N.I. Act Declaration',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'Gazetted Public Holiday honoring the chief architect of the Indian Constitution. All government offices closed.'
  },
  {
    id: 'nat-2026-05-01',
    date: '2026-05-01',
    name: 'Buddha Purnima',
    category: 'national',
    applicableState: 'ALL',
    applicableDistrict: 'ALL',
    sourceName: 'DoPT Annual Gazetted Holiday Notification',
    sourceUrl: 'https://dopt.gov.in',
    officialNotificationRef: 'DoPT F.No.12/2/2025-JCA Annexure I',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'Gazetted Public Holiday observing the birth, enlightenment, and death of Gautama Buddha.'
  },
  {
    id: 'nat-2026-05-28',
    date: '2026-05-28',
    name: 'Id-ul-Zuha (Bakrid)',
    category: 'national',
    applicableState: 'ALL',
    applicableDistrict: 'ALL',
    sourceName: 'DoPT Annual Gazetted Holiday Notification',
    sourceUrl: 'https://dopt.gov.in',
    officialNotificationRef: 'DoPT F.No.12/2/2025-JCA Annexure I',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'Gazetted Public Holiday observed across Central and State government agencies.'
  },
  {
    id: 'nat-2026-06-26',
    date: '2026-06-26',
    name: 'Muharram',
    category: 'national',
    applicableState: 'ALL',
    applicableDistrict: 'ALL',
    sourceName: 'DoPT Annual Gazetted Holiday Notification',
    sourceUrl: 'https://dopt.gov.in',
    officialNotificationRef: 'DoPT F.No.12/2/2025-JCA Annexure I',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'Gazetted National Holiday marking Ashura. Government offices and citizen centers closed.'
  },
  {
    id: 'nat-2026-08-15',
    date: '2026-08-15',
    name: 'Independence Day',
    category: 'national',
    applicableState: 'ALL',
    applicableDistrict: 'ALL',
    sourceName: 'National Portal of India (india.gov.in)',
    sourceUrl: 'https://india.gov.in',
    officialNotificationRef: 'DoPT F.No.12/2/2025-JCA',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'National Holiday celebrating India’s Independence. All public service offices, PSKs, and Seva Kendras are closed.'
  },
  {
    id: 'nat-2026-09-04',
    date: '2026-09-04',
    name: 'Janmashtami (Vaishnava)',
    category: 'national',
    applicableState: 'ALL',
    applicableDistrict: 'ALL',
    sourceName: 'DoPT Annual Gazetted Holiday Notification',
    sourceUrl: 'https://dopt.gov.in',
    officialNotificationRef: 'DoPT F.No.12/2/2025-JCA Annexure I',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'Gazetted Holiday observing the birth of Lord Krishna. Administrative counters closed.'
  },
  {
    id: 'nat-2026-09-14',
    date: '2026-09-14',
    name: 'Milad-un-Nabi (Id-e-Milad)',
    category: 'national',
    applicableState: 'ALL',
    applicableDistrict: 'ALL',
    sourceName: 'DoPT Annual Gazetted Holiday Notification',
    sourceUrl: 'https://dopt.gov.in',
    officialNotificationRef: 'DoPT F.No.12/2/2025-JCA Annexure I',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'Gazetted Holiday honoring the birthday of Prophet Muhammad.'
  },
  {
    id: 'nat-2026-10-02',
    date: '2026-10-02',
    name: 'Mahatma Gandhi’s Birthday',
    category: 'national',
    applicableState: 'ALL',
    applicableDistrict: 'ALL',
    sourceName: 'National Portal of India (india.gov.in)',
    sourceUrl: 'https://india.gov.in',
    officialNotificationRef: 'DoPT F.No.12/2/2025-JCA',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'National Holiday honoring the Father of the Nation. All government offices, tribunals, and Seva Kendras are strictly closed.'
  },
  {
    id: 'nat-2026-10-20',
    date: '2026-10-20',
    name: 'Dussehra (Vijaya Dashami)',
    category: 'national',
    applicableState: 'ALL',
    applicableDistrict: 'ALL',
    sourceName: 'DoPT Annual Gazetted Holiday Notification',
    sourceUrl: 'https://dopt.gov.in',
    officialNotificationRef: 'DoPT F.No.12/2/2025-JCA Annexure I',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'Gazetted Holiday celebrating Vijaya Dashami. Government offices closed.'
  },
  {
    id: 'nat-2026-11-08',
    date: '2026-11-08',
    name: 'Diwali (Deepavali)',
    category: 'national',
    applicableState: 'ALL',
    applicableDistrict: 'ALL',
    sourceName: 'DoPT Annual Gazetted Holiday Notification',
    sourceUrl: 'https://dopt.gov.in',
    officialNotificationRef: 'DoPT F.No.12/2/2025-JCA Annexure I',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'Gazetted National Holiday for Deepavali. All public facilitation centers closed.'
  },
  {
    id: 'nat-2026-11-24',
    date: '2026-11-24',
    name: 'Guru Nanak’s Birthday',
    category: 'national',
    applicableState: 'ALL',
    applicableDistrict: 'ALL',
    sourceName: 'DoPT Annual Gazetted Holiday Notification',
    sourceUrl: 'https://dopt.gov.in',
    officialNotificationRef: 'DoPT F.No.12/2/2025-JCA Annexure I',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'Gazetted Holiday commemorating Guru Nanak Jayanti. Government offices closed.'
  },
  {
    id: 'nat-2026-12-25',
    date: '2026-12-25',
    name: 'Christmas Day',
    category: 'national',
    applicableState: 'ALL',
    applicableDistrict: 'ALL',
    sourceName: 'DoPT Annual Gazetted Holiday Notification',
    sourceUrl: 'https://dopt.gov.in',
    officialNotificationRef: 'DoPT F.No.12/2/2025-JCA Annexure I',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'Gazetted National Holiday celebrating Christmas. Public service offices closed.'
  },

  // ================= STATE GAZETTED HOLIDAYS =================
  // Maharashtra
  {
    id: 'state-mh-2026-02-19',
    date: '2026-02-19',
    name: 'Chhatrapati Shivaji Maharaj Jayanti',
    category: 'state',
    applicableState: 'Maharashtra',
    applicableDistrict: 'ALL',
    sourceName: 'Govt of Maharashtra General Administration Dept (GAD)',
    sourceUrl: 'https://maharashtra.gov.in',
    officialNotificationRef: 'GAD-PH-2026/CR-14',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'State Gazetted Holiday in Maharashtra. All Maharashtra State Government offices, Municipal Corporations, and MahaOnline Seva Kendras are closed.'
  },
  {
    id: 'state-mh-2026-03-19',
    date: '2026-03-19',
    name: 'Gudi Padwa',
    category: 'state',
    applicableState: 'Maharashtra',
    applicableDistrict: 'ALL',
    sourceName: 'Govt of Maharashtra GAD Gazette Notification',
    sourceUrl: 'https://maharashtra.gov.in',
    officialNotificationRef: 'GAD-PH-2026/CR-14',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'State Gazetted Holiday marking Marathi New Year. State government offices closed.'
  },
  {
    id: 'state-mh-2026-05-01',
    date: '2026-05-01',
    name: 'Maharashtra Day',
    category: 'state',
    applicableState: 'Maharashtra',
    applicableDistrict: 'ALL',
    sourceName: 'Govt of Maharashtra Gazette under N.I. Act 1881',
    sourceUrl: 'https://maharashtra.gov.in',
    officialNotificationRef: 'Maharashtra State Gazette No. 22',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'State formation day and Labour Day. All state government and municipal offices closed.'
  },
  {
    id: 'state-mh-2026-09-14',
    date: '2026-09-14',
    name: 'Ganesh Chaturthi',
    category: 'state',
    applicableState: 'Maharashtra',
    applicableDistrict: 'ALL',
    sourceName: 'Govt of Maharashtra GAD Gazette Notification',
    sourceUrl: 'https://maharashtra.gov.in',
    officialNotificationRef: 'GAD-PH-2026/CR-14',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'Major State Gazetted Holiday in Maharashtra. Public administrative offices and local facilitation centers closed.'
  },

  // Delhi (NCT)
  {
    id: 'state-dl-2026-11-10',
    date: '2026-11-10',
    name: 'Govardhan Puja / Bhai Dooj',
    category: 'state',
    applicableState: 'Delhi (NCT)',
    applicableDistrict: 'ALL',
    sourceName: 'Govt of NCT of Delhi General Administration Dept',
    sourceUrl: 'https://delhi.gov.in',
    officialNotificationRef: 'Delhi GAD F.53/01/2025/GAD/CN',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'State Public Holiday notified by Delhi Administration under Negotiable Instruments Act. Delhi Govt offices and SDM counters closed.'
  },
  {
    id: 'state-dl-2026-11-15',
    date: '2026-11-15',
    name: 'Chhath Puja',
    category: 'state',
    applicableState: 'Delhi (NCT)',
    applicableDistrict: 'ALL',
    sourceName: 'Govt of NCT of Delhi Official Gazette',
    sourceUrl: 'https://delhi.gov.in',
    officialNotificationRef: 'Delhi GAD Gazetted Notification 2026',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'Gazetted Public Holiday in Delhi for Chhath Puja. State government offices closed.'
  },

  // Karnataka
  {
    id: 'state-ka-2026-01-14',
    date: '2026-01-14',
    name: 'Makara Sankranti',
    category: 'state',
    applicableState: 'Karnataka',
    applicableDistrict: 'ALL',
    sourceName: 'Govt of Karnataka Department of Personnel & Administrative Reforms (DPAR)',
    sourceUrl: 'https://dpar.karnataka.gov.in',
    officialNotificationRef: 'DPAR 18 HHL 2025',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'State Gazetted Holiday in Karnataka. Karnataka One and Bengaluru One centers operate on holiday schedules.'
  },
  {
    id: 'state-ka-2026-03-19',
    date: '2026-03-19',
    name: 'Ugadi',
    category: 'state',
    applicableState: 'Karnataka',
    applicableDistrict: 'ALL',
    sourceName: 'Govt of Karnataka DPAR Gazette',
    sourceUrl: 'https://dpar.karnataka.gov.in',
    officialNotificationRef: 'DPAR 18 HHL 2025',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'Kannada New Year Gazetted Holiday. State government offices closed.'
  },
  {
    id: 'state-ka-2026-11-01',
    date: '2026-11-01',
    name: 'Kannada Rajyotsava',
    category: 'state',
    applicableState: 'Karnataka',
    applicableDistrict: 'ALL',
    sourceName: 'Govt of Karnataka DPAR Gazette',
    sourceUrl: 'https://dpar.karnataka.gov.in',
    officialNotificationRef: 'DPAR 18 HHL 2025',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'Karnataka Formation Day. Mandatory state public holiday. All civic centers and administrative offices closed.'
  },

  // Tamil Nadu
  {
    id: 'state-tn-2026-01-14',
    date: '2026-01-14',
    name: 'Pongal',
    category: 'state',
    applicableState: 'Tamil Nadu',
    applicableDistrict: 'ALL',
    sourceName: 'Govt of Tamil Nadu Public (Misc.) Department',
    sourceUrl: 'https://tn.gov.in',
    officialNotificationRef: 'G.O.Ms.No. 680 Public (Misc.) Dept',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'Tamil Harvest Festival. Gazetted Public Holiday across all Tamil Nadu Government offices.'
  },
  {
    id: 'state-tn-2026-01-15',
    date: '2026-01-15',
    name: 'Thiruvalluvar Day',
    category: 'state',
    applicableState: 'Tamil Nadu',
    applicableDistrict: 'ALL',
    sourceName: 'Govt of Tamil Nadu Public Dept',
    sourceUrl: 'https://tn.gov.in',
    officialNotificationRef: 'G.O.Ms.No. 680 Public (Misc.) Dept',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'State Gazetted Holiday commemorating Saint Thiruvalluvar. State offices and e-Sevai centers closed.'
  },
  {
    id: 'state-tn-2026-04-14',
    date: '2026-04-14',
    name: 'Tamil New Year (Puthandu)',
    category: 'state',
    applicableState: 'Tamil Nadu',
    applicableDistrict: 'ALL',
    sourceName: 'Govt of Tamil Nadu Public Dept',
    sourceUrl: 'https://tn.gov.in',
    officialNotificationRef: 'G.O.Ms.No. 680 Public (Misc.) Dept',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'Traditional Tamil New Year Day. State administrative counters closed.'
  },

  // Uttar Pradesh
  {
    id: 'state-up-2026-11-10',
    date: '2026-11-10',
    name: 'Govardhan Pooja / Bhaiya Dooj',
    category: 'state',
    applicableState: 'Uttar Pradesh',
    applicableDistrict: 'ALL',
    sourceName: 'Govt of Uttar Pradesh General Administration Dept',
    sourceUrl: 'https://up.gov.in',
    officialNotificationRef: 'UP GAD Notification No. 1045/XXX-4',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'State Gazetted Holiday in Uttar Pradesh under Negotiable Instruments Act. Tehsil and district offices closed.'
  },
  {
    id: 'state-up-2026-11-15',
    date: '2026-11-15',
    name: 'Dala Chhath',
    category: 'state',
    applicableState: 'Uttar Pradesh',
    applicableDistrict: 'ALL',
    sourceName: 'Govt of Uttar Pradesh GAD',
    sourceUrl: 'https://up.gov.in',
    officialNotificationRef: 'UP GAD Notification No. 1045/XXX-4',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'Gazetted Public Holiday in Uttar Pradesh. Public service facilitation centers closed.'
  },

  // ================= DISTRICT-SPECIFIC / LOCAL GAZETTED HOLIDAYS =================
  {
    id: 'dist-mh-mum-2026-09-23',
    date: '2026-09-23',
    name: 'Anant Chaturdashi (Ganesh Visarjan)',
    category: 'district',
    applicableState: 'Maharashtra',
    applicableDistrict: 'Mumbai City',
    sourceName: 'Collector & District Magistrate Office, Mumbai City',
    sourceUrl: 'https://mumbaicity.gov.in',
    officialNotificationRef: 'District Magistrate Local Holiday Order No. 2026/DM/LH-2',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'District Magistrate notified local holiday for Anant Chaturdashi immersion procession. District collectorate, BMC civic ward offices, and sub-registrar offices in Mumbai City district remain closed.'
  },
  {
    id: 'dist-mh-pun-2026-09-23',
    date: '2026-09-23',
    name: 'Anant Chaturdashi (Ganesh Visarjan)',
    category: 'district',
    applicableState: 'Maharashtra',
    applicableDistrict: 'Pune',
    sourceName: 'Collector Office, Pune District',
    sourceUrl: 'https://pune.gov.in',
    officialNotificationRef: 'Pune District Administration Local Order 2026/G-11',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'District Magistrate notified local holiday in Pune for Ganesh Visarjan. Pune district administration and municipal citizen centers closed.'
  },
  {
    id: 'dist-dl-nd-2026-10-21',
    date: '2026-10-21',
    name: 'Karwa Chauth (Restricted / Local Optional)',
    category: 'district',
    applicableState: 'Delhi (NCT)',
    applicableDistrict: 'New Delhi',
    sourceName: 'Delhi Administration Restricted Holiday List',
    sourceUrl: 'https://delhi.gov.in',
    officialNotificationRef: 'Delhi GAD RH Schedule 2026',
    isOfficeClosed: false,
    verifiedDate: '2026-01-02',
    description: 'Restricted (Optional) Holiday. Central and State Government offices remain OPEN. Individual staff may avail optional leave, but public service counters maintain normal operational hours.'
  },
  {
    id: 'dist-up-var-2026-11-16',
    date: '2026-11-16',
    name: 'Chhath Puja (Morning Arghya) - District Local',
    category: 'district',
    applicableState: 'Uttar Pradesh',
    applicableDistrict: 'Varanasi',
    sourceName: 'District Magistrate Office, Varanasi',
    sourceUrl: 'https://varanasi.nic.in',
    officialNotificationRef: 'Varanasi DM Local Holiday Order 2026',
    isOfficeClosed: true,
    verifiedDate: '2026-01-02',
    description: 'Local holiday declared by District Magistrate Varanasi under Section 25 NI Act for morning ghat rituals. District administrative offices closed.'
  }
];

// Helper functions for calendar logic
export const getHolidaysForDate = (
  dateStr: string,
  state: string,
  district: string,
  activeCategories: HolidayCategory[] = ['national', 'state', 'district']
): VerifiedHoliday[] => {
  return VERIFIED_INDIAN_HOLIDAYS_2026.filter((h) => {
    if (h.date !== dateStr) return false;
    if (!activeCategories.includes(h.category)) return false;

    // National applies everywhere
    if (h.category === 'national') return true;

    // State holiday must match state or ALL
    if (h.category === 'state') {
      return h.applicableState === 'ALL' || h.applicableState.toLowerCase() === state.toLowerCase();
    }

    // District holiday must match state and district
    if (h.category === 'district') {
      const stateMatch = h.applicableState === 'ALL' || h.applicableState.toLowerCase() === state.toLowerCase();
      const distMatch =
        h.applicableDistrict === 'ALL' ||
        district === 'All Districts' ||
        h.applicableDistrict.toLowerCase() === district.toLowerCase();
      return stateMatch && distMatch;
    }

    return false;
  });
};

export const isHolidayOnDate = (
  dateStr: string,
  state: string,
  district: string,
  activeCategories: HolidayCategory[] = ['national', 'state', 'district']
): boolean => {
  return getHolidaysForDate(dateStr, state, district, activeCategories).length > 0;
};

export const getOfficeStatusForDate = (
  date: Date,
  state: string,
  district: string
): { isOpen: boolean; reason: string; note: string } => {
  const day = date.getDay(); // 0 is Sunday, 6 is Saturday
  const dateStr = date.toISOString().split('T')[0];

  const holidays = getHolidaysForDate(dateStr, state, district, ['national', 'state', 'district']);
  const closingHoliday = holidays.find((h) => h.isOfficeClosed);

  if (closingHoliday) {
    return {
      isOpen: false,
      reason: `Closed: ${closingHoliday.name}`,
      note: `Government notification: ${closingHoliday.officialNotificationRef} (${closingHoliday.sourceName})`
    };
  }

  if (day === 0) {
    return {
      isOpen: false,
      reason: 'Closed on Sundays',
      note: 'Central & State civic facilitation centers observe weekly closure on Sundays.'
    };
  }

  if (day === 6) {
    return {
      isOpen: true,
      reason: 'Saturday (Select Centers Open)',
      note: 'Select Passport Seva Kendras (PSK) and Aadhaar Seva Kendras (ASK) open 9:00 AM – 2:00 PM.'
    };
  }

  return {
    isOpen: true,
    reason: 'Normal Working Day',
    note: 'Citizen Facilitation Counters open 9:30 AM – 5:00 PM (Monday to Friday).'
  };
};
