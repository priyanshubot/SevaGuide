import { Office } from '../types';

export const OFFICES_DATA: Office[] = [
  {
    id: 'off-1',
    name: 'District Facilitation Centre / Lok Seva Kendra',
    serviceIds: [
      'pan-correction',
      'aadhaar-update',
      'aadhaar-enrolment',
      'cg-domicile-certificate',
      'cg-caste-scst',
      'cg-caste-obc',
      'cg-pension-ignoaps',
      'cg-pension-ignwps',
      'cg-pension-igndps'
    ],
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
    serviceIds: ['aadhaar-update', 'aadhaar-enrolment'],
    address: 'Main Road, Supela, Bhilai, Chhattisgarh 490023',
    latitude: 21.2012,
    longitude: 81.3341,
    distanceKm: 4.1,
    phone: '+91 1947',
    hours: 'Mon - Sun: 9:00 AM - 6:00 PM',
    isOpen: false
  },
  {
    id: 'off-4',
    name: 'Regional Transport Office (RTO) Durg',
    serviceIds: ['dl-learners', 'dl-permanent', 'dl-renewal', 'dl-duplicate'],
    address: 'G.E. Road, Durg, Chhattisgarh 491001',
    latitude: 21.1904,
    longitude: 81.2849,
    distanceKm: 6.8,
    phone: '+91 788 232 2322',
    hours: 'Mon - Fri: 10:00 AM - 5:00 PM',
    isOpen: true
  }
];