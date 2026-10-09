import { Office } from '../types';

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
];